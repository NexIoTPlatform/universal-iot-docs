---
layout: false
permalink: /iframe/articlePage/aside
article: false
---

<script setup lang="ts">
import { TkArticlePage } from "vitepress-theme-teek";
</script>

<TkArticlePage doc aside class="demo-article-page-aside">
  <h1 id="一级标题">
    一级标题
    <a class="header-anchor" href="#一级标题" aria-label="Permalink to '一级标题'" />
  </h1>
  <h2 id="二级标题">
    二级标题
    <a class="header-anchor" href="#二级标题" aria-label="Permalink to '二级标题'" />
  </h2>
  <p>Teek 是一个轻量、简洁高效、灵活配置的 VitePress 主题</p>
  <h3 id="三级标题">
    三级标题
    <a class="header-anchor" href="#三级标题" aria-label="Permalink to '三级标题'" />
  </h3>
  <p>Teek 是一个轻量、简洁高效、灵活配置的 VitePress 主题</p>
</TkArticlePage>

<style>
.demo-article-page-aside {
  margin: 0;
}

.demo-article-page-aside .tk-article-page__aside {
  display: block;
}
</style>
