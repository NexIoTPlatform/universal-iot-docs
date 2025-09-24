import { computed, MaybeRefOrGetter, ref, toValue, watch } from "vue";
import { useScopeDispose } from "./useScopeDispose";

export interface TypesOption {
  /**
   * 打字间隔时间，单位：毫秒
   */
  inputTime?: number;
  /**
   * 删字间隔时间，单位：毫秒
   */
  outputTime?: number;
  /**
   * 获取新数据间隔时间，单位：毫秒
   */
  nextTime?: number;
  /**
   * 是否随机获取新数据
   */
  shuffle?: boolean;
  /**
   * data 发生变化，是否重新加载
   *
   * @default false
   */
  reloadWhenDataChanged?: boolean;
}

/**
 * 打字功能
 *
 * @param data 数据
 * @param option 配置项
 */
export const useTextTypes = (data: MaybeRefOrGetter<string[]>, options: TypesOption = {}) => {
  const { inputTime = 200, outputTime = 100, nextTime = 800, shuffle = false, reloadWhenDataChanged = false } = options;
  const dataComputed = computed(() => toValue(data) || []);

  const text = ref("");
  const isFinished = ref(false);

  let originText = "";
  let inputTimer: ReturnType<typeof setInterval> | null;
  let outputTimer: ReturnType<typeof setInterval> | null;
  // 为 originText 长度服务
  let textIndex = 0;
  // 为 dataComputed 下标服务
  let dataIndex = 0;

  const clearInputTimer = () => {
    if (inputTimer) {
      clearInterval(inputTimer);
      inputTimer = null;
    }
  };

  const clearOutputTimer = () => {
    if (outputTimer) {
      clearInterval(outputTimer);
      outputTimer = null;
    }
  };

  /**
   * 打字
   */
  const typesIn = () => {
    isFinished.value = false;
    originText = dataComputed.value[dataIndex];

    if (!originText) return stop();

    text.value = originText.substring(0, textIndex++);

    if (textIndex > originText.length) {
      clearInputTimer();
      isFinished.value = true;
      setTimeout(() => {
        outputTimer = setInterval(() => {
          typesOut();
        }, outputTime);
      }, nextTime);
    }
  };
  /**
   * 删字
   */
  const typesOut = () => {
    if (textIndex >= 0) {
      isFinished.value = false;
      text.value = originText.substring(0, textIndex--);
    } else {
      clearOutputTimer();
      isFinished.value = true;

      setTimeout(() => {
        if (shuffle) {
          // 随机选择下一个文本
          let newIndex: number;
          do {
            newIndex = Math.floor(Math.random() * dataComputed.value.length);
          } while (newIndex === dataIndex);

          dataIndex = newIndex;
        } else {
          // 按顺序选择下一个文本
          dataIndex = (dataIndex + 1) % dataComputed.value.length;
        }

        inputTimer = setInterval(() => {
          typesIn();
        }, inputTime);
      }, nextTime);
    }
  };

  /**
   * 开始打字
   */
  const start = () => {
    isFinished.value = false;
    inputTimer = setInterval(() => {
      typesIn();
    }, inputTime);
  };

  /**
   * 停止打字
   *
   * @param restore 是否还原数据为开始状态
   */
  const stop = (restore = false) => {
    clearInputTimer();
    clearOutputTimer();
    isFinished.value = false;

    if (restore) {
      text.value = "";
      originText = "";
      textIndex = 0;
      dataIndex = 0;
    }
  };

  /**
   * 重启打字
   */
  const restart = () => {
    stop(true);
    start();
  };

  if (reloadWhenDataChanged) watch(dataComputed, () => restart());

  useScopeDispose(stop);

  return { text, isFinished, start, stop, restart };
};

export type UseTextTypesReturn = ReturnType<typeof useTextTypes>;
