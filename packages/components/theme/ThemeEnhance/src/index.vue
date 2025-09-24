<script setup lang="ts" name="ThemeEnhance">
import type { ThemeEnhance } from "@teek/config";
import { computed } from "vue";
import { readingIcon } from "@teek/static";
import { useMediaQuery } from "@teek/composables";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";
import { TkPopover } from "@teek/components/common/Popover";
import { ns } from "./namespace";
import { mobileMaxWidthMedia } from "./themeEnhance";
import LayoutSwitch from "./LayoutSwitch.vue";
import LayoutPageWidthSlide from "./LayoutPageWidthSlide.vue";
import LayoutDocWidthSlide from "./LayoutDocWidthSlide.vue";
import ThemeColor from "./ThemeColor.vue";
import Spotlight from "./Spotlight.vue";
import SpotlightStyle from "./SpotlightStyle.vue";

defineOptions({ name: "ThemeEnhance" });

defineProps<{ position: "top" | "bottom" }>();

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", { position: "top" });

const isMobile = useMediaQuery(mobileMaxWidthMedia);

const disabledList = computed(() => {
  return {
    layoutSwitch: themeEnhanceConfig.value.layoutSwitch?.disabled ?? true,
    themeColor: themeEnhanceConfig.value.themeColor?.disabled ?? false,
    spotlight: themeEnhanceConfig.value.spotlight?.disabled ?? false,
  };
});

// 检查是否所有功能都被禁用
const allDisabled = computed(() => {
  return disabledList.value.layoutSwitch && disabledList.value.themeColor && disabledList.value.spotlight;
});
</script>

<template>
  <TkPopover
    v-if="!isMobile && themeEnhanceConfig.position === 'top' && !allDisabled"
    :class="[ns.b(), ns.is(position), 'flx-align-center']"
    :popper-class="ns.e('popover')"
    :y-offset="-15"
  >
    <template #reference>
      <TkIcon :icon="readingIcon" :size="20" />
    </template>
    <div :class="ns.e('content')">
      <slot name="teek-theme-enhance-top" />

      <template v-if="!allDisabled">
        <template v-if="!disabledList.layoutSwitch">
          <LayoutSwitch />
          <LayoutPageWidthSlide />
          <LayoutDocWidthSlide />
        </template>

        <template v-if="!disabledList.themeColor">
          <ThemeColor />
        </template>

        <template v-if="!disabledList.spotlight">
          <Spotlight />
          <SpotlightStyle />
        </template>
      </template>

      <slot name="teek-theme-enhance-bottom" />
    </div>
  </TkPopover>
</template>
