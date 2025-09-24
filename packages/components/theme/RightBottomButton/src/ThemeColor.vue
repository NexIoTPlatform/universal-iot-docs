<script setup lang="ts" name="ThemeColor">
import type { ThemeEnhance } from "@teek/config";
import { computed, onMounted, watch } from "vue";
import { useData } from "vitepress";
import { useLocale, useStorage } from "@teek/composables";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";
import { TkPopover } from "@teek/components/common/Popover";
import { ThemeColor, themeColorAttribute, themeColorStorageKey } from "@teek/components/theme/ThemeEnhance";
import { magicIcon } from "@teek/static";
import { ns } from "./namespace";

defineOptions({ name: "ThemeColor" });

const { t } = useLocale();

const { frontmatter } = useData();
const { getTeekConfigRef } = useTeekConfig();

const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});

const themeColor = useStorage<string>(
  themeColorStorageKey,
  themeEnhanceConfig.value.themeColor?.defaultColor || ThemeColor.vpDefault
);

const update = (val: typeof themeColor.value | string) => {
  const el = document.documentElement;

  themeColor.value = val;

  if (el.getAttribute(themeColorAttribute) === val) return;
  el.setAttribute(themeColorAttribute, val);
};

/**
 * 支持文章单独设置主题色
 */
watch(
  () => frontmatter.value.themeColor,
  newVal => {
    if (newVal) update(newVal);
  }
);

onMounted(() => {
  if (frontmatter.value.themeColor) update(frontmatter.value.themeColor);
  else update(themeColor.value);
});

const themeColorList = computed(() => {
  const { append = [] } = themeEnhanceConfig.value.themeColor || {};
  return [
    {
      label: t("tk.themeEnhance.themeColor.vpLabel"),
      tip: t("tk.themeEnhance.themeColor.vpTip"),
      options: [
        { label: t("tk.themeEnhance.themeColor.defaultLabel"), value: "vp-default" },
        { label: t("tk.themeEnhance.themeColor.greenLabel"), value: "vp-green" },
        { label: t("tk.themeEnhance.themeColor.yellowLabel"), value: "vp-yellow" },
        { label: t("tk.themeEnhance.themeColor.redLabel"), value: "vp-red" },
      ],
    },
    {
      label: t("tk.themeEnhance.themeColor.epLabel"),
      tip: t("tk.themeEnhance.themeColor.epTip"),
      options: [
        { label: t("tk.themeEnhance.themeColor.blueLabel"), value: "ep-blue" },
        { label: t("tk.themeEnhance.themeColor.greenLabel"), value: "ep-green" },
        { label: t("tk.themeEnhance.themeColor.yellowLabel"), value: "ep-yellow" },
        { label: t("tk.themeEnhance.themeColor.redLabel"), value: "ep-red" },
      ],
    },
    ...append,
  ] as { label: string; tip: string; options: { label: string; value: string }[] }[];
});
</script>

<template>
  <TkPopover
    :class="ns.e('button')"
    :popper-class="ns.e('dropdown')"
    placement="left-start"
    :width="120"
    :x-offset="15"
    :transition-name="ns.joinNamespace('fade-scale')"
    :title="t('tk.themeEnhance.themeColor.title')"
    role="button"
    :aria-label="t('tk.themeEnhance.themeColor.title')"
  >
    <template #reference>
      <TkIcon :icon="magicIcon" aria-hidden="true" />
    </template>
    <ul v-for="item in themeColorList" :key="item.label">
      <li :class="`${ns.e('dropdown__title')} sle`" :title="item.tip" :aria-label="item.label">
        {{ item.label }}
      </li>
      <li>
        <ul>
          <li
            v-for="option in item.options"
            :key="item.label + option.value"
            :class="['dropdown-item', 'sle', { active: option.value === themeColor }]"
            @click="update(option.value)"
            role="button"
            :aria-label="option.label"
          >
            {{ option.label }}
          </li>
        </ul>
      </li>
    </ul>
  </TkPopover>
</template>
