import type { Ref, SetupContext } from "vue";
import type { PopoverEmits } from "./popover";
import { ref } from "vue";

export const useFocusTrap = (visible: Ref<boolean>, emit: SetupContext<PopoverEmits>["emit"]) => {
  const focusStartRef = ref<"container" | "first" | HTMLElement>();

  /**
   * 进入焦点陷阱（打开弹框）
   */
  const onFocusAfterTrapped = () => {
    emit("focus");
  };
  /**
   * 离开焦点陷阱
   */
  const onFocusAfterReleased = (event: CustomEvent) => {
    if (event.detail?.focusReason !== "pointer") {
      focusStartRef.value = "first";
      emit("blur");
    }
  };
  /**
   * focusin 事件
   */
  const onFocusInTrap = (event: FocusEvent) => {
    if (visible.value && event.target) {
      focusStartRef.value = event.target as typeof focusStartRef.value;
    }
  };
  /**
   * 阻止离开
   */
  const onFocusoutPrevented = (event: CustomEvent) => {
    if (event.detail.focusReason === "pointer") {
      event.preventDefault();
    }
  };
  /**
   * Escape 按键释放焦点
   */
  const onReleaseRequested = () => {
    emit("close");
  };

  return {
    focusStartRef,
    onFocusAfterTrapped,
    onFocusAfterReleased,
    onFocusInTrap,
    onFocusoutPrevented,
    onReleaseRequested,
  };
};
