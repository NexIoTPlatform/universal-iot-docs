/**
 * 防抖函数
 *
 * @param func 回调函数
 * @param delay 延迟时间
 * @param immediate 是否立即执行，如果为 true，则立即执行回调函数，否则在延迟时间后执行
 */
export const useDebounce = <T extends (...args: any[]) => any>(func: T, delay = 0, immediate = false) => {
  let timer: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<T>) => {
    const callNow = immediate && !timer;
    if (callNow) func(...args);

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const later = () => {
      clearTimer();
      if (!immediate) func(...args);
    };

    clearTimer();
    timer = setTimeout(later, delay);
  };
};

export type UseDebounceReturn = ReturnType<typeof useDebounce>;
