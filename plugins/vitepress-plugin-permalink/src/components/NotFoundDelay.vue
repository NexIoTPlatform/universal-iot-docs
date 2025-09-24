<script setup lang="ts" name="NotFoundDelay">
import type { NotFoundOption } from "..";
import { useRouter, useData } from "vitepress";
import { nextTick, onMounted, ref, unref } from "vue";
// @ts-ignore
import option from "virtual:not-found-option";
import NotFound from "vitepress/dist/client/theme-default/NotFound.vue";

const { notFoundDelayLoad = 500 } = { ...option } as NotFoundOption;
const { title } = useData();

// 禁止加载 404 页面
const disableNotFoundPage = ref(true);

const delayNotFoundPage = () => {
  document.title = "";
  disableNotFoundPage.value = true;
  // 延迟 notFoundDelayLoad 再加载 404 页面。因为 permalink 插件支持自定义 URL，但是 VP 初始化时根据自定义 URL 寻找文档会 404，因此这里延迟来给 permalink 插件寻找正确的文档路径
  setTimeout(() => {
    disableNotFoundPage.value = false;
    nextTick(() => (document.title = unref(title)));
  }, notFoundDelayLoad);
};

onMounted(() => {
  delayNotFoundPage();
});

const router = useRouter();
const state = router.state || {};

// 防止重复在 router 添加函数
if (!state.permalinkPluginNotFoundDelay) {
  const selfOnBeforeRouteChange = router.onBeforeRouteChange;
  router.onBeforeRouteChange = (href: string) => {
    delayNotFoundPage();

    return selfOnBeforeRouteChange?.(href);
  };

  router.state = { ...state, permalinkPluginNotFoundDelay: true };
}
</script>

<template>
  <template v-if="!disableNotFoundPage">
    <slot name="not-found"><NotFound /></slot>
  </template>
</template>
