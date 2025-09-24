import Teek from "vitepress-theme-teek";
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue";
import CommercialPlugins from "../../components/CommercialPlugins.vue";

// Teek 本地主题包引用（与 Teek 在线主题包引用 二选一）
import "@teek/theme-chalk/vp-plus/code-block-mobile.scss";
import "@teek/theme-chalk/vp-plus/sidebar.scss";
import "@teek/theme-chalk/vp-plus/nav.scss";
import "@teek/theme-chalk/vp-plus/aside.scss";
import "@teek/theme-chalk/vp-plus/doc-h1-gradient.scss";
import "@teek/theme-chalk/vp-plus/table.scss";
import "@teek/theme-chalk/vp-plus/mark.scss";
import "@teek/theme-chalk/vp-plus/blockquote.scss";
import "@teek/theme-chalk/vp-plus/index-rainbow.scss";
import "@teek/theme-chalk/vp-plus/doc-fade-in.scss";
import "@teek/theme-chalk/tk-plus/banner-desc-gradient.scss"; // 博客风格 Banner 描述渐变样式

// Teek 在线主题包引用（需安装 Teek 在线版本）
// import "vitepress-theme-teek/index.css";
// import "vitepress-theme-teek/theme-chalk/vp-plus/code-block-mobile.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/sidebar.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/nav.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/aside.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/doc-h1-gradient.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/table.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/mark.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/blockquote.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/index-rainbow.scss";
// import "vitepress-theme-teek/theme-chalk/vp-plus/doc-fade-in.scss";
// import "vitepress-theme-teek/theme-chalk/tk-plus/banner-desc-gradient.scss";

import "./styles/code-bg.scss";
import "./styles/iframe.scss";
import "./styles/sidebar-overrides.scss";

export default {
  extends: Teek,
  Layout: TeekLayoutProvider,
  enhanceApp({ app }) {
    app.component('CommercialPlugins', CommercialPlugins);
  },
};
