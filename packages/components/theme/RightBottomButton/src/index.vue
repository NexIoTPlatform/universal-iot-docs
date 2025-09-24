<script setup lang="ts" name="RightBottomButton">
import type { TeekConfig, ThemeEnhance } from "@teek/config";
import { computed } from "vue";
import { useData } from "vitepress";
import { isBoolean } from "@teek/helper";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { mobileMaxWidthMedia, TkThemeEnhance } from "@teek/components/theme/ThemeEnhance";
import { useMediaQuery } from "@teek/composables";
import { ns } from "./namespace";
import BackTop from "./BackTop.vue";
import ToComment from "./ToComment.vue";
import ThemeColor from "./ThemeColor.vue";

defineOptions({ name: "RightBottomButton" });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});
const teekConfig = getTeekConfigRef<Required<TeekConfig>>(null, { comment: { provider: "" } });
const { frontmatter } = useData();

const commentConfig = computed(() => {
  const comment = frontmatter.value.comment ?? teekConfig.value.comment;
  if (isBoolean(comment)) return { enabled: comment };

  return { enabled: true, provider: comment.provider };
});

const isMobile = useMediaQuery(mobileMaxWidthMedia);
const disabledThemeColor = computed(() => {
  const { themeColor = {} } = themeEnhanceConfig.value;
  return !isMobile.value || (themeColor.disabled ?? themeColor.disabledInMobile);
});

// 检查是否所有功能都被禁用
const allDisabled = computed(() => {
  const { layoutSwitch = {}, themeColor = {}, spotlight = {} } = themeEnhanceConfig.value;
  return (layoutSwitch.disabled ?? true) && (themeColor.disabled ?? false) && (spotlight.disabled ?? false);
});
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('wallpaper-outside'), 'flx-column']">
    <slot name="teek-right-bottom-before" />

    <BackTop />
    <ToComment v-if="commentConfig.enabled && commentConfig.provider" />
    <TkThemeEnhance
      v-if="!isMobile && themeEnhanceConfig.position === 'bottom' && !allDisabled"
      :class="ns.e('button')"
      position="bottom"
      :y-offset="7"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]><slot :name="name" /></template>
    </TkThemeEnhance>

    <ThemeColor v-if="!disabledThemeColor" />

    <slot name="teek-right-bottom-after" />
  </div>
</template>
