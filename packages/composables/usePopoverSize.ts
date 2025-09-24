import { computed, MaybeRefOrGetter, nextTick, ref, toValue } from "vue";
import { useWindowSize } from "./useWindowSize";
import { useScrollbarSize } from "./useScrollbarSize";
import { isClient, isString } from "@teek/helper";
import { useEventListener } from "./useEventListener";

export interface UsePopoverSizeOptions {
  placement?:
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "top"
    | "top-start"
    | "top-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
  /**
   * 偏移量，等价于 `xOffset` 和 `yOffset`
   *
   * @default 0
   */
  offset?: number;
  /**
   * x 偏移量
   *
   * @default 0
   */
  xOffset?: number;
  /**
   * y 偏移量
   *
   * @default 0
   */
  yOffset?: number;
}

export type NumStr = number | string;

const AUTO = "auto";
// 默认距离 trigger 像素
const defaultSpace = 10;

/**
 * 获取 Popover 的位置
 *
 * @param trigger 触发器元素
 * @param popover 弹框元素
 * @param options 配置项
 * @remark 返回的 top、right、bottom、left 是基于 body 的坐标，因此 Popover 需要移到 body 下
 */
export const usePopoverSize = (
  trigger: MaybeRefOrGetter<EventTarget | null | undefined>,
  popover: MaybeRefOrGetter<EventTarget | null | undefined>,
  options: UsePopoverSizeOptions = {}
) => {
  const { placement = "bottom", offset = 0, xOffset = 0, yOffset = 0 } = options;

  const top = ref<NumStr>(AUTO);
  const right = ref<NumStr>(AUTO);
  const bottom = ref<NumStr>(AUTO);
  const left = ref<NumStr>(AUTO);

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const { width: scrollbarWidth, height: scrollbarHeight } = useScrollbarSize();

  const triggerEl = computed(() => {
    const plain = toValue(trigger);
    return (plain as any)?.$el ?? plain;
  });

  const popoverEl = computed(() => {
    const plain = toValue(popover);
    return (plain as any)?.$el ?? plain;
  });

  /**
   * 计算 Popover 的位置
   */
  const calculatePosition = async () => {
    if (!isClient || !triggerEl.value || !popoverEl.value) return;

    await nextTick();

    const {
      top: triggerTop,
      right: triggerLeftWidth, // 等于 left + width
      bottom: triggerTopHeigh, // 等于 top + height
      left: triggerLeft,
      width: triggerWidth,
      height: triggerHeight,
    } = triggerEl.value.getBoundingClientRect();

    // 计算 trigger 实际的 right 和 bottom
    const triggerRight = windowWidth.value - triggerLeftWidth;
    const triggerBottom = windowHeight.value - triggerTopHeigh;

    const popoverWidth = popoverEl.value.offsetWidth;
    const popoverHeight = popoverEl.value.offsetHeight;

    // 兼容滚动和设置偏移量
    const x = window.scrollX + (offset || xOffset);
    const y = window.scrollY + (offset || yOffset);

    let popoverTop: NumStr = AUTO;
    let popoverRight: NumStr = AUTO;
    let popoverBottom: NumStr = AUTO;
    let popoverLeft: NumStr = AUTO;

    const placementIsY = ["top", "bottom"].some(item => placement.startsWith(item));
    const placementIsX = ["left", "right"].some(item => placement.startsWith(item));

    const expectTop = () => triggerTop + triggerHeight + y;
    const expectRight = () => triggerRight + triggerWidth - x - scrollbarWidth.value;
    const expectBottom = () => triggerBottom + triggerHeight - y - scrollbarHeight.value;
    const expectLeft = () => triggerLeft + triggerWidth + x;

    if (placementIsY) {
      // 计算 top-xx 和 bottom-xx 通用位置：left 和 right
      if (placement.endsWith("start")) popoverLeft = expectLeft() - triggerWidth;
      else if (placement.endsWith("end")) popoverRight = expectRight() - triggerWidth;
      else popoverLeft = triggerLeft + triggerWidth / 2 - popoverWidth / 2 + x; // 居中
    } else if (placementIsX) {
      // 计算 left-xx 和 right-xx 通用位置：top 和 bottom
      if (placement.endsWith("start")) popoverTop = expectTop() - triggerHeight;
      else if (placement.endsWith("end")) popoverBottom = expectBottom() - triggerHeight;
      else popoverTop = triggerTop + triggerHeight / 2 - popoverHeight / 2 + y; // 居中
    }

    // 计算非通用的位置
    if (placement.startsWith("top")) popoverBottom = expectBottom() + defaultSpace;
    else if (placement.startsWith("right")) popoverLeft = expectLeft() + defaultSpace;
    else if (placement.startsWith("bottom")) popoverTop = expectTop() + defaultSpace;
    else if (placement.startsWith("left")) popoverRight = expectRight() + defaultSpace;

    const isOverTop = () => !isString(popoverBottom) && popoverBottom + popoverHeight > windowHeight.value - y;
    const isOverRight = () => !isString(popoverLeft) && popoverLeft + popoverWidth > windowWidth.value + x;
    const isOverBottom = () => !isString(popoverTop) && popoverTop + popoverHeight > windowHeight.value + y;
    const isOverLeft = () => !isString(popoverRight) && popoverRight + popoverWidth > windowWidth.value - x;

    // 弹框超出上边界，则移动到下边，如果也超出下边界，则还原位置
    if (isOverTop()) {
      popoverTop = (placementIsX ? expectTop() - triggerHeight : expectTop()) + defaultSpace;
      if (isOverBottom()) popoverTop = AUTO;
      else popoverBottom = AUTO;
    }

    // 弹框超出下边界，则移动到上边，如果也超出上边界，则还原位置
    if (isOverBottom()) {
      popoverBottom = (placementIsX ? expectBottom() - triggerHeight : expectBottom()) + defaultSpace;
      if (isOverTop()) popoverBottom = AUTO;
      else popoverTop = AUTO;
    }

    // 弹框超出右边界，则移动到左边，如果也超出左边界，则还原位置
    if (isOverRight()) {
      popoverRight = (placementIsY ? expectRight() - triggerWidth : expectRight()) + defaultSpace;
      if (isOverLeft()) popoverRight = AUTO;
      else popoverLeft = AUTO;
    }
    // 弹框超出左边界，则移动到右边，如果也超出右边界，则还原位置
    if (isOverLeft()) {
      popoverLeft = (placementIsY ? expectLeft() - triggerWidth : expectLeft()) + defaultSpace;
      if (isOverRight()) popoverLeft = AUTO;
      else popoverRight = AUTO;
    }

    top.value = popoverTop;
    right.value = popoverRight;
    bottom.value = popoverBottom;
    left.value = popoverLeft;
  };

  // 初始计算
  calculatePosition();

  const update = () => {
    calculatePosition();
  };

  // 滚动、尺寸变化时重新更新
  useEventListener(() => window, "scroll", update);
  useEventListener(() => window, "resize", update);

  return { top, right, bottom, left, update };
};
