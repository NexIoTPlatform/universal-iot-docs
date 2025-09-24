<script setup lang="ts" name="Popover">
import type { PopoverProps, PopoverEmits } from "./popover";
import { computed, ref, watch, onBeforeMount } from "vue";
import { useNamespace, useZIndex, useElementHover, usePopoverSize, onClickOutside } from "@teek/composables";
import { addUnit } from "@teek/helper";
import { TkFocusTrap } from "@teek/components/common/FocusTrap";
import { useFocusTrap } from "./useFocusTrap";

defineOptions({ name: "Popover" });

const {
  placement = "bottom",
  content = "",
  trigger = "hover",
  width,
  height,
  offset = 0,
  xOffset = 0,
  yOffset = 0,
  disabled = false,
  transition = true,
  transitionName,
  triggerEl,
  beforePopup,
  zIndex,
  popperClass,
  popperStyle,
} = defineProps<PopoverProps>();

const ns = useNamespace("popover");

const { nextZIndex } = useZIndex();
const zIndexRef = ref(zIndex ?? nextZIndex());

const visible = defineModel({ default: false });

const triggerRef = ref();
const popoverRef = ref();
const isHovered = useElementHover(triggerRef);
const popupVisible = useElementHover(popoverRef);

const triggerElComputed = computed(() => triggerEl || triggerRef.value);

const { top, right, left, bottom, update } = usePopoverSize(triggerElComputed, popoverRef, {
  placement,
  offset,
  xOffset,
  yOffset,
});

const popupStyle = computed(() => {
  return {
    zIndex: zIndexRef.value,
    top: addUnit(top.value),
    right: addUnit(right.value),
    bottom: addUnit(bottom.value),
    left: addUnit(left.value),
    width: addUnit(width),
    height: addUnit(height),
    ...popperStyle,
  };
});

/**
 * 计算弹框的位置
 */
const calculatePopoverPosition = () => {
  if (!triggerRef.value || !popoverRef.value) {
    visible.value = false;
    return;
  }

  update();

  // 弹出前回调，支持修改弹框的位置
  const result =
    beforePopup?.({
      top: top.value,
      right: right.value,
      bottom: left.value,
      left: bottom.value,
      triggerElement: triggerEl || triggerRef.value,
      popoverElement: popoverRef.value,
    }) ?? {};

  if (result.top) top.value = result.top;
  if (result.right) right.value = result.right;
  if (result.bottom) bottom.value = result.bottom;
  if (result.left) left.value = result.left;
};

if (trigger === "hover") {
  // 鼠标悬停打开，离开关闭
  watch(isHovered, newVal => {
    if (trigger === "hover") visible.value = newVal;
  });
}

const toggleVisible = (event: typeof trigger) => {
  if (event === trigger) visible.value = !visible.value;
};

// 窗口打开时，计算位置
watch(visible, newVal => {
  if (newVal) calculatePopoverPosition();
});
// 如果为 hover，则鼠标悬停在弹框内，不关闭弹框
watch(popupVisible, newVal => {
  if (trigger === "hover") visible.value = newVal;
});

// 点击其他区域关闭弹框
onClickOutside(popoverRef, e => {
  // 如果点击了触发元素，则不关闭弹框
  if (e.composedPath().includes(triggerRef.value)) return;
  if (trigger === "hover") return;
  if (visible.value !== false) visible.value = false;
});

const popoverContainerId = ns.joinNamespace("popover-container");

onBeforeMount(() => {
  // 所有的 Popover 放在 body 下的一个 div 里
  const popoverContainer = document.querySelector(`#${popoverContainerId}`);
  if (!popoverContainer) {
    const container = document.createElement("div");
    container.id = popoverContainerId;
    document.body.appendChild(container);
  }
});

const emit = defineEmits<PopoverEmits>();

// 焦点切换时，焦点不允许离开弹框，需重新循环
const {
  focusStartRef,
  onFocusAfterTrapped,
  onFocusAfterReleased,
  onFocusInTrap,
  onFocusoutPrevented,
  onReleaseRequested,
} = useFocusTrap(visible, emit);
</script>

<template>
  <div
    ref="triggerRef"
    @click="toggleVisible('click')"
    @contextmenu="toggleVisible('contextmenu')"
    @focus="toggleVisible('focus')"
    @touchstart="visible = !visible"
    v-bind="$attrs"
  >
    <slot name="reference" />
  </div>

  <Teleport :to="`#${popoverContainerId}`">
    <Transition :name="transition ? transitionName || ns.joinNamespace('fade-linear') : ''">
      <div
        v-if="!disabled"
        v-show="visible"
        ref="popoverRef"
        :style="popupStyle"
        :class="[ns.b(), popperClass]"
        @click.stop
        @touchstart.stop
      >
        <TkFocusTrap
          loop
          :trapped="visible"
          :focus-trap-el="popoverRef!"
          :focus-start-el="focusStartRef"
          @focus-after-trapped="onFocusAfterTrapped"
          @focus-after-released="onFocusAfterReleased"
          @focusin="onFocusInTrap"
          @focusout-prevented="onFocusoutPrevented"
          @release-requested="onReleaseRequested"
        >
          <slot>{{ content }}</slot>
        </TkFocusTrap>
      </div>
    </Transition>
  </Teleport>
</template>
