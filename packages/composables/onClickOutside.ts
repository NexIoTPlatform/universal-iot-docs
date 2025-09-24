// From https://github.com/vueuse/vueuse/blob/main/packages/core/onClickOutside/index.ts
import type { ComponentPublicInstance, MaybeRef, MaybeRefOrGetter, VNode } from "vue";
import { toValue } from "vue";
import { isClient, isIOS } from "@teek/helper";
import { useEventListener } from "./useEventListener";

export type VueInstance = ComponentPublicInstance;
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>;
export type MaybeElement = HTMLElement | SVGElement | VueInstance | undefined | null;

export interface OnClickOutsideOptions<Controls extends boolean = false> {
  /**
   * 忽略的元素（传入元素选择器）
   */
  ignore?: MaybeRefOrGetter<(MaybeRef | string)[]>;
  /**
   * 事件监听配置项是否使用 capture
   *
   * @default true
   */
  capture?: boolean;
  /**
   * 焦点移动到 iframe 时，是否触发 onClickOutside
   *
   * @default false
   */
  detectIframe?: boolean;
  /**
   * 是否使用控件控制
   *
   * @default false
   */
  controls?: Controls;
}

/**
 * 监听点击事件，判断是否点击到目标元素外
 */
export type OnClickOutsideHandler<
  T extends {
    detectIframe: OnClickOutsideOptions["detectIframe"];
    controls: boolean;
  } = { detectIframe: false; controls: false },
> = (
  event: T["controls"] extends true
    ? Event | (T["detectIframe"] extends true ? PointerEvent | FocusEvent : PointerEvent)
    : T["detectIframe"] extends true
      ? PointerEvent | FocusEvent
      : PointerEvent
) => void;

let _iOSWorkaround = false;

export const onClickOutside = (
  target: MaybeRef<MaybeElementRef>,
  handler: OnClickOutsideHandler,
  options: OnClickOutsideOptions<boolean> = {}
) => {
  const { ignore = [], capture = true, detectIframe = false, controls = false } = options;

  if (!isClient) {
    return controls ? { stop: () => {}, cancel: () => {}, trigger: () => {} } : () => {};
  }

  if (isIOS() && !_iOSWorkaround) {
    _iOSWorkaround = true;
    const listenerOptions = { passive: true };
    Array.from(window.document.body.children).forEach(el => useEventListener(el, "click", () => {}, listenerOptions));
    useEventListener(window.document.documentElement, "click", () => {}, listenerOptions);
  }

  let shouldListen = true;

  const shouldIgnore = (event: Event) => {
    return toValue(ignore).some(target => {
      if (typeof target === "string") {
        return Array.from(window.document.querySelectorAll(target)).some(
          el => el === event.target || event.composedPath().includes(el)
        );
      } else {
        const el = toValue(target);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };

  /**
   * 确定给定的目标是否有多个根元素
   * Referenced from: https://github.com/vuejs/test-utils/blob/ccb460be55f9f6be05ab708500a41ec8adf6f4bc/src/vue-wrapper.ts#L21
   */
  function hasMultipleRoots(target: MaybeRef<MaybeElementRef>): boolean {
    const vm = toValue(target) as ComponentPublicInstance;
    return vm && vm.$.subTree.shapeFlag === 16;
  }

  function checkMultipleRoots(target: MaybeRef<MaybeElementRef>, event: Event): boolean {
    const vm = toValue(target) as ComponentPublicInstance;
    const children = vm.$.subTree && vm.$.subTree.children;

    if (children == null || !Array.isArray(children)) return false;

    // @ts-expect-error should be VNode
    return children.some((child: VNode) => child.el === event.target || event.composedPath().includes(child.el));
  }

  const listener = (event: Event) => {
    const plain = toValue(target);
    const el = (plain as VueInstance)?.$el ?? plain;

    if (event.target == null) return;

    if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event)) return;

    if (!el || el === event.target || event.composedPath().includes(el)) return;

    if ("detail" in event && event.detail === 0) shouldListen = !shouldIgnore(event);

    if (!shouldListen) {
      shouldListen = true;
      return;
    }

    handler(event as any);
  };

  let isProcessingClick = false;

  const cleanup = [
    useEventListener(
      window,
      "click",
      (event: PointerEvent) => {
        if (!isProcessingClick) {
          isProcessingClick = true;
          setTimeout(() => {
            isProcessingClick = false;
          }, 0);
          listener(event);
        }
      },
      { passive: true, capture }
    ),
    useEventListener(
      window,
      "pointerdown",
      e => {
        const plain = toValue(target);
        const el = (plain as VueInstance)?.$el ?? plain;
        shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
      },
      { passive: true }
    ),
    detectIframe &&
      useEventListener(
        window,
        "blur",
        event => {
          setTimeout(() => {
            const plain = toValue(target);
            const el = (plain as VueInstance)?.$el ?? plain;
            if (window.document.activeElement?.tagName === "IFRAME" && !el?.contains(window.document.activeElement)) {
              handler(event as any);
            }
          }, 0);
        },
        { passive: true }
      ),
  ].filter(Boolean) as (() => void)[];

  const stop = () => cleanup.forEach(fn => fn());

  if (controls) {
    return {
      stop,
      cancel: () => {
        shouldListen = false;
      },
      trigger: (event: Event) => {
        shouldListen = true;
        listener(event);
        shouldListen = false;
      },
    };
  }

  return stop;
};
