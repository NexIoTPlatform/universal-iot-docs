<script setup lang="ts" name="LayoutSwitch">
import type { ThemeEnhance } from "@teek/config";
import type { LayoutModeVal } from "./themeEnhance";
import { computed, ref, watch } from "vue";
import { useData } from "vitepress";
import { isClient } from "@teek/helper";
import { useStorage, useMediaQuery, useLocale } from "@teek/composables";
import { fullscreenIcon, fullScreenOneIcon, fullscreenTwoIcon, layoutIcon, overallReductionIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkSegmented } from "@teek/components/common/Segmented";
import { LayoutMode, layoutModeAttribute, mobileMaxWidthMedia } from "./themeEnhance";
import { layoutModeStorageKey } from "./namespace";
import { useAnimated } from "./useAnimated";
import BaseTemplate from "./components/BaseTemplate.vue";

defineOptions({ name: "LayoutSwitch" });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();
const { frontmatter } = useData();

const layoutMode = useStorage(
  layoutModeStorageKey,
  themeEnhanceConfig.value.layoutSwitch?.defaultMode || LayoutMode.Original
);
const isMobile = useMediaQuery(mobileMaxWidthMedia);

const oldLayoutMode = ref(layoutMode.value);

const { start: startAnimated } = useAnimated();

const update = (val: LayoutModeVal) => {
  if (!isClient) return;
  const { layoutSwitch } = themeEnhanceConfig.value;
  if (!layoutSwitch?.disableAnimation) startAnimated();

  const el = document.documentElement;

  if (el.getAttribute(layoutModeAttribute) === val) return;
  el.setAttribute(layoutModeAttribute, val);

  themeEnhanceConfig.value.layoutSwitch?.switchModeDone?.(val);
};

// 切换布局模式
watch(layoutMode, update, { immediate: true });
// 文章单独设置布局模式
watch(
  () => frontmatter.value.layoutMode,
  newVal => {
    if (newVal) {
      oldLayoutMode.value = layoutMode.value;
      layoutMode.value = newVal;
    } else {
      // 还原为全局配置
      layoutMode.value = oldLayoutMode.value;
    }
  },
  { immediate: true }
);
// 如果默认值发生改变，则更新布局模式
watch(
  () => themeEnhanceConfig.value.layoutSwitch?.defaultMode,
  newVal => {
    if (newVal) layoutMode.value = newVal;
  }
);

const content = computed(() => [
  {
    value: LayoutMode.FullWidth,
    title: t("tk.themeEnhance.layoutSwitch.fullWidthTipTitle"),
    tipContent: t("tk.themeEnhance.layoutSwitch.fullWidthHelpTipContent"),
    icon: fullScreenOneIcon,
  },
  {
    value: LayoutMode.SidebarWidthAdjustableOnly,
    title: t("tk.themeEnhance.layoutSwitch.sidebarWidthAdjustableOnlyTipTitle"),
    tipContent: t("tk.themeEnhance.layoutSwitch.sidebarWidthAdjustableOnlyHelpTipContent"),
    icon: fullscreenTwoIcon,
  },
  {
    value: LayoutMode.BothWidthAdjustable,
    title: t("tk.themeEnhance.layoutSwitch.bothWidthAdjustableTipTitle"),
    tipContent: t("tk.themeEnhance.layoutSwitch.bothWidthAdjustableHelpTipContent"),
    icon: fullscreenIcon,
  },
  {
    value: LayoutMode.Original,
    title: t("tk.themeEnhance.layoutSwitch.originalWidthTipTitle"),
    tipContent: t("tk.themeEnhance.layoutSwitch.originalWidthHelpTipContent"),
    icon: overallReductionIcon,
  },
]);

const segmentedOptions = computed(() =>
  content.value.map(item => ({
    value: item.value,
    title: item.title,
    ariaLabel: item.title,
    icon: item.icon,
  }))
);

const tips = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.tipContent,
  }))
);
</script>

<template>
  <BaseTemplate
    :icon="layoutIcon"
    :title="t('tk.themeEnhance.layoutSwitch.title')"
    :helper="!themeEnhanceConfig.layoutSwitch?.disableHelp"
    :helper-desc="t('tk.themeEnhance.layoutSwitch.helpDesc')"
    :tips
    :disabled="isMobile"
  >
    <TkSegmented v-model="layoutMode" :options="segmentedOptions" :disabled="isMobile" />
  </BaseTemplate>
</template>
