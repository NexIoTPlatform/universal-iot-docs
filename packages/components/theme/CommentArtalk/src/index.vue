<script setup lang="ts" name="CommentArtalk">
import type { CommentProvider } from "@teek/config";
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { isClient } from "@teek/helper";
import { useNamespace, useVpRouter } from "@teek/composables";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { artalkContext } from "./artalk";

defineOptions({ name: "CommentArtalk" });

const ns = useNamespace();
const vpRouter = useVpRouter();

const { getTeekConfig } = useTeekConfig();
const { isDark, page } = useData();

const artalkOptions = getTeekConfig<CommentProvider["artalk"]>("comment", {}).options;

const { server, site, ...options } = artalkOptions;

const artalkRef = ref<HTMLElement | null>(null);
const artalkJs = ref<HTMLScriptElement | null>(null);
const artalk = ref();
const artalkId = "artalk";

const initArtalkByInject = () => {
  // 尝试从上下文获取 artalk 实例函数
  const getArtalkInstance = inject(artalkContext, () => null);
  const el = artalkRef.value || `#${artalkId}`;

  const artalkInstance = getArtalkInstance?.(el, artalkOptions);

  if (!artalkInstance) return false;

  artalk.value = artalkInstance;
  switchDark();

  return true;
};

const initArtalkByJs = () => {
  if (!isClient) return console.error("[Teek Error] Not in a client");

  const Artalk = (window as any).Artalk;
  const el = artalkRef.value || `#${artalkId}`;

  if (!Artalk || !artalkRef.value) {
    return console.error("[Teek Error] Artalk initialization failed. Unable to load online js file from " + server);
  }

  artalk.value = Artalk.init({
    darkMode: isDark.value,
    ...options,
    el,
    pageKey: vpRouter.route.path,
    pageTitle: page.value.title,
    server: server,
    site: site,
  });

  switchDark();
};

const initJs = () => {
  const t = artalkJs.value;
  if (t) t.onload = initArtalkByJs;
};

const reloadArtalk = () => {
  const a = artalk.value;
  a?.update({
    pageKey: vpRouter.route.path,
    pageTitle: page.value.title,
  });

  a?.reload();
};

onMounted(() => {
  // 尝试从上下文初始化 artalk 实例，如果初始化失败，则尝试通过在线 JS 文件初始化 artalk 实例
  if (!initArtalkByInject() && server) {
    initJs();
    // 路由切换后更新评论内容
    return artalk.value && vpRouter.bindAfterRouteChange(ns.joinNamespace("artalk"), () => reloadArtalk());
  }

  console.error(
    "[Teek Error] Artalk initialization failed. Please configure the 'server' and 'site' or provide the artalk instance"
  );
});

onUnmounted(() => {
  const a = artalk.value;
  if (a) a.destroy();
});

const switchDark = () => {
  setTimeout(() => {
    const a = artalk.value;
    if (a) a.setDarkMode(isDark.value);
  }, 100);
};

watch(isDark, () => switchDark());
</script>

<template>
  <div :class="ns.b('artalk')">
    <link v-if="server" rel="stylesheet" :href="`${server}/dist/Artalk.css`" crossorigin="anonymous" />
    <div :id="artalkId" ref="artalkRef" />
    <component v-if="server" :is="'script'" :src="`${server}/dist/Artalk.js`" crossorigin="anonymous" ref="artalkJs" />
  </div>
</template>
