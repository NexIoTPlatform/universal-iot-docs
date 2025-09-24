import type { MaybeRefOrGetter } from "vue";
import { computed, toValue, watch } from "vue";
import { useScopeDispose } from "./useScopeDispose";
import { isClient } from "@teek/helper";

/**
 * mounted 监听事件，unmounted 移出监听事件
 *
 * @param el 监听元素
 * @param event 监听事件
 * @param handler 事件处理函数
 * @param options 监听选项
 * @param condition 监听条件
 * @returns 移除事件的函数
 */
export const useEventListener = (
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  event: string,
  handler: (event: any) => void,
  options?: AddEventListenerOptions | boolean
) => {
  const cleanups: Function[] = [];

  const cleanup = () => {
    cleanups.forEach(fn => fn());
    cleanups.length = 0;
  };

  const register = (
    el: EventTarget,
    event: string,
    listener: any,
    options: boolean | AddEventListenerOptions | undefined
  ) => {
    el.addEventListener(event, listener, options);

    // 存到 cleanups
    return () => el.removeEventListener(event, listener, options);
  };

  const el = computed(() => {
    if (!isClient) return;

    const plain = toValue(target) || window;
    return (plain as any)?.$el ?? plain;
  });

  const stopWatch = watch(
    el,
    val => {
      cleanup();
      if (!val) return;

      cleanups.push(register(val, event, handler, options));
    },
    { flush: "post", immediate: true } // flush: "post" 确保在组件挂载后执行
  );

  const stop = () => {
    stopWatch();
    cleanup();
  };

  // 组件销毁时执行 cleanup
  useScopeDispose(cleanup);

  // 返回移除事件的函数
  return stop;
};
