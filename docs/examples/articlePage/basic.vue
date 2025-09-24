<script setup lang="ts">
import { TkArticlePage } from "vitepress-theme-teek";
</script>

<template>
  <TkArticlePage class="demo-article-page-basic">
    <h1>一级标题</h1>
    <h2>二级标题</h2>
    <p>Teek 是一个轻量、简洁高效、灵活配置的 VitePress 主题</p>
    <h3>三级标题</h3>
    <p>Teek 是一个轻量、简洁高效、灵活配置的 VitePress 主题</p>
  </TkArticlePage>
</template>

<style>
/* 当前示例位于文章页内，自动应用文章页内的样式，因此这里需要取消父元素样式影响，实际不需要这段代码 */
.demo-article-page-basic {
  all: initial;
}
</style>
