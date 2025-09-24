import type { ShallowRef, MaybeRefOrGetter } from "vue";
import { shallowRef } from "vue";
import { isClient } from "@teek/helper";
import { useEventListener } from "./useEventListener";

export interface UseElementHoverOptions {
  /**
   * 延迟进入的时间，单位毫秒
   *
   * @default 0
   */
  delayEnter?: number;
  /**
   * 延迟离开的时间，单位毫秒
   *
   *  @default 0
   */
  delayLeave?: number;
}

export const useElementHover = (
  el: MaybeRefOrGetter<EventTarget | null | undefined>,
  options: UseElementHoverOptions = {}
): ShallowRef<boolean> => {
  const { delayEnter = 0, delayLeave = 0 } = options;

  const isHovered = shallowRef(false);
  let timer: ReturnType<typeof setTimeout> | null;

  const toggle = (entering: boolean) => {
    const delay = entering ? delayEnter : delayLeave;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (delay) timer = setTimeout(() => (isHovered.value = entering), delay);
    else isHovered.value = entering;
  };

  if (!isClient) return isHovered;

  useEventListener(el, "mouseenter", () => toggle(true), { passive: true });
  useEventListener(el, "mouseleave", () => toggle(false), { passive: true });

  return isHovered;
};

export type UseElementHoverReturn = ReturnType<typeof useElementHover>;
