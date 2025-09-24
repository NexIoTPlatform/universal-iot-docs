import { isClient } from "@teek/helper";
import { layoutModeAttribute } from "./themeEnhance";
import { MaybeRefOrGetter, toValue } from "vue";
import { useScopeDispose } from "@teek/composables";

/**
 * 加载动画
 *
 * @param immediate 是否第一次调用方法时加载动画，（为 false 场景：在初始化页面的时候不需要加载动画，而是在实际操作的时候加载动画）
 */
export const useAnimated = (delay: MaybeRefOrGetter = 1000, immediate = false) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const stop = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const start = () => {
    if (!isClient) return;
    if (!immediate) {
      immediate = true;
      return;
    }

    stop();

    // 动画开启，执行后再关闭
    document.documentElement.setAttribute(`${layoutModeAttribute}-animated`, "true");
    timer = setTimeout(() => {
      document.documentElement.removeAttribute(`${layoutModeAttribute}-animated`);
    }, toValue(delay));
  };

  useScopeDispose(stop);

  return { start, stop };
};
