import { computed, MaybeRefOrGetter, ref, toValue, watch } from "vue";
import { useScopeDispose } from "./useScopeDispose";

export interface UseScrollDataOptions {
  /**
   * 自动滚动间隔时间
   *
   * @default 3000
   */
  intervalTime?: number;
  /**
   * data 发生变化，是否重新加载
   *
   * @default false
   */
  reloadWhenDataChanged?: boolean;
}

/**
 * 定时对数据进行截取，实现滚动
 *
 * @param data 数据
 * @param limit 显示数量
 * @param options 配置项
 */
export const useScrollData = (data: MaybeRefOrGetter<any[]>, limit: number, options: UseScrollDataOptions = {}) => {
  const { intervalTime = 3000, reloadWhenDataChanged = false } = options;
  const dataComputed = computed(() => toValue(data) || []);

  // 初始化滚动数据
  const visibleData = ref(dataComputed.value.slice(0, limit));
  let currentIndex = limit;
  let timer: ReturnType<typeof setInterval> | null = null;

  const scrollData = () => {
    const nextIndex = (currentIndex + 1) % dataComputed.value.length;

    visibleData.value.push(dataComputed.value[nextIndex]);
    visibleData.value.shift();

    currentIndex = nextIndex;
  };

  /**
   * 开启滚动
   */
  const start = () => {
    scrollData();
    timer = setInterval(() => {
      scrollData();
    }, intervalTime);
  };

  /**
   * 关闭滚动
   *
   *  @param restore 是否还原数据为开始状态
   */
  const stop = (restore = false) => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (restore) {
      visibleData.value = dataComputed.value.slice(0, limit);
      currentIndex = limit;
    }
  };

  /**
   * 重启数据滚动
   */
  const restart = () => {
    stop(true);
    start();
  };

  if (reloadWhenDataChanged) watch(dataComputed, () => restart());

  useScopeDispose(stop);

  return {
    data: visibleData,
    start,
    stop,
    restart,
  };
};

export type UseScrollDataReturn = ReturnType<typeof useScrollData>;
