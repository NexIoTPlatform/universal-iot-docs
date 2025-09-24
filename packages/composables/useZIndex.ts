import type { InjectionKey, Ref } from "vue";
import { computed, getCurrentInstance, inject, ref } from "vue";
import { isNumber } from "@teek/helper";

export interface zIndexInjectionContext {
  current: number;
}

const initial: zIndexInjectionContext = {
  current: 0,
};

// 全局 z-index，不会重复
const zIndex = ref(0);

export const defaultInitialZIndex = 2000;

// For SSR
export const Z_INDEX_INJECTION_KEY: InjectionKey<zIndexInjectionContext> = Symbol("tkZIndexContextKey");

export const zIndexContextKey: InjectionKey<Ref<number | undefined>> = Symbol("zIndexContextKey");

/**
 * 获取 z-index，如果没有通过函数传参或 inject 传入，则第一个 z-index 取 defaultInitialZIndex
 *
 * @scene 使用于悬浮或反复消失再出现的组件，如弹框
 */
export const useZIndex = (zIndexOverrides?: Ref<number>) => {
  const increasingInjection = getCurrentInstance() ? inject(Z_INDEX_INJECTION_KEY, initial) : initial;

  // 获取传入的 z-index
  const zIndexInjection = zIndexOverrides || (getCurrentInstance() ? inject(zIndexContextKey, undefined) : undefined);

  // 获取最终可用的 z-index
  const initialZIndex = computed(() => {
    const zIndexFromInjection = zIndexInjection?.value;
    return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
  });

  const currentZIndex = computed(() => initialZIndex.value + zIndex.value);

  // 获取下一个可用的 z-index
  const nextZIndex = () => {
    increasingInjection.current++;
    zIndex.value = increasingInjection.current;
    return currentZIndex.value;
  };

  if (inject(Z_INDEX_INJECTION_KEY, undefined)) {
    console.warn(
      "ZIndexInjection",
      `Looks like you are using server rendering, you must provide a z-index provider to ensure the hydration process to be succeed
usage: app.provide(ZINDEX_INJECTION_KEY, { current: 0 })`
    );
  }

  return {
    initialZIndex,
    currentZIndex,
    nextZIndex,
  };
};

export type UseZIndexReturn = ReturnType<typeof useZIndex>;
