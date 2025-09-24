<script setup lang="ts" name="SpotlightStyle">
import type { ThemeEnhance } from "@teek/config";
import { computed } from "vue";
import { useStorage, useMediaQuery, useLocale } from "@teek/composables";
import { clickIcon, alignLeftIcon, alignTextLeftIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkSegmented } from "@teek/components/common/Segmented";
import { SpotlightStyle, touchMedia } from "./themeEnhance";
import { spotlightStyleStorageKey, spotlightStorageKey, transitionName } from "./namespace";
import BaseTemplate from "./components/BaseTemplate.vue";

defineOptions({ name: "SpotlightStyle" });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});
const { t } = useLocale();

const spotlightStyle = useStorage(
  spotlightStyleStorageKey,
  themeEnhanceConfig.value.spotlight?.defaultStyle || SpotlightStyle.Aside
);
const spotlightToggledOn = useStorage(spotlightStorageKey, themeEnhanceConfig.value.spotlight?.defaultValue ?? true);
const isMobile = useMediaQuery(touchMedia);

const content = computed(() => [
  {
    value: SpotlightStyle.Aside,
    title: t("tk.themeEnhance.spotlightStyles.asideTipTitle"),
    helpMessage: t("tk.themeEnhance.spotlightStyles.asideHelpTipContent"),
    ariaLabel: t("tk.themeEnhance.spotlightStyles.asideTipTitle"),
    icon: alignTextLeftIcon,
  },
  {
    value: SpotlightStyle.Under,
    title: t("tk.themeEnhance.spotlightStyles.underTipTitle"),
    helpMessage: t("tk.themeEnhance.spotlightStyles.underHelpTipContent"),
    ariaLabel: t("tk.themeEnhance.spotlightStyles.underTipTitle"),
    icon: alignLeftIcon,
  },
]);

const segmentedOptions = computed(() =>
  content.value.map(item => ({
    value: item.value,
    title: item.title,
    ariaLabel: item.ariaLabel,
    icon: item.icon,
  }))
);

const tips = computed(() =>
  content.value.map(item => ({
    title: item.title,
    icon: item.icon,
    content: item.helpMessage,
  }))
);
</script>

<template>
  <Transition :name="transitionName">
    <BaseTemplate
      v-if="spotlightToggledOn"
      :icon="clickIcon"
      :title="t('tk.themeEnhance.spotlightStyles.title')"
      :helper="!themeEnhanceConfig.spotlight?.disableHelp"
      :helper-desc="t('tk.themeEnhance.spotlightStyles.helpDesc')"
      :tips
      :disabled="isMobile"
    >
      <TkSegmented v-model="spotlightStyle" :options="segmentedOptions" :disabled="isMobile" />
    </BaseTemplate>
  </Transition>
</template>
