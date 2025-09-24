import { ref } from "vue";
import { isClient } from "@teek/helper";
import { useEventListener } from "./useEventListener";
import { useMounted } from "./useMounted";
import { useScopeDispose } from "./useScopeDispose";

/**
 * 获取滚动条的 width 和 height
 */
export const useScrollbarSize = () => {
  const width = ref(0);
  const height = ref(0);

  let measureElement: HTMLDivElement | null = null;
  const createMeasureElement = () => {
    if (measureElement) return measureElement;

    document.querySelector("#measure-element")?.remove();

    measureElement = document.createElement("div");
    measureElement.id = "measure-element";
    // 设置样式强制显示滚动条
    measureElement.style.cssText = `
        position: fixed;
        top: -9999px;
        left: 0;
        width: 100px;
        height: 100px;
        overflow: scroll;
        visibility: hidden;
      `;
    document.body.appendChild(measureElement);

    return measureElement;
  };

  const clearMeasureElement = () => {
    if (!measureElement) return;

    if (document.body.contains(measureElement)) {
      document.body.removeChild(measureElement);
      measureElement = null;
    }
  };

  const calculate = () => {
    if (!isClient) return;

    const docElem = document.documentElement;
    const isQuirksMode = document.compatMode === "BackCompat";

    // 检测垂直滚动条
    const hasVertical = isQuirksMode
      ? document.body.scrollHeight > document.body.clientHeight
      : docElem.scrollHeight > docElem.clientHeight;
    // 检测水平滚动条
    const hasHorizontal = isQuirksMode
      ? document.body.scrollWidth > document.body.clientWidth
      : docElem.scrollWidth > docElem.clientWidth;

    if (!hasVertical && !hasHorizontal) {
      width.value = 0;
      height.value = 0;
      return;
    }

    const measure = createMeasureElement();

    // 计算滚动条尺寸
    width.value = hasVertical ? measure.offsetWidth - measure.clientWidth : 0;
    height.value = hasHorizontal ? measure.offsetHeight - measure.clientHeight : 0;
  };

  const update = () => {
    calculate();
  };

  useEventListener(() => window, "resize", update);

  // TODO 使用 MutationObserver 监听 DOM 变化，然后触发 update 方法

  useMounted(() => {
    // 初始化测量元素
    createMeasureElement();
    calculate();
  });

  // 初始计算
  calculate();

  useScopeDispose(clearMeasureElement);

  return { width, height, update };
};
