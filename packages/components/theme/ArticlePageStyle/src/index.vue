<script setup lang="ts" name="ArticlePageStyle">
import type { TeekConfig } from "@teek/config";
import { watch, nextTick } from "vue";
import { isClient } from "@teek/helper";
import { useNamespace } from "@teek/composables";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";

const ns = useNamespace();
const { getTeekConfigRef } = useTeekConfig();

const themeConfig = getTeekConfigRef<TeekConfig>(null, {
  vpHome: true,
  pageStyle: "default",
});

const initPageStyle = async () => {
  if (!isClient) return;
  await nextTick();

  const tkLayoutDom = document.querySelector(`.${ns.joinNamespace("layout")}`);
  // 清除可能已经存在的 pageStyle
  ["default", "card", "card-nav", "segment", "segment-nav"].forEach(item =>
    tkLayoutDom?.classList.remove(ns.joinNamespace(item))
  );

  tkLayoutDom?.classList.add(ns.joinNamespace(themeConfig.value.pageStyle));
};

watch(() => themeConfig.value.pageStyle, initPageStyle, { immediate: true });

// vpHome 配置项变化，会重置 tk-layout 的 dom，因此需要重新设置 pageStyle
watch(() => themeConfig.value.vpHome, initPageStyle);
</script>

<template></template>
