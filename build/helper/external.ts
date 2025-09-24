// 打 umd 包时针对 external 外部依赖指定全局变量名称
export const globals = {
  vue: "Vue",
  vite: "Vite",
  vitepress: "VitePress",
  "vitepress/theme": "VitePressTheme",
  "node:path": "node:path",
  "node:fs": "node:fs",
  fs: "fs",
  "@iconify/vue": "IconifyVue",
};

// full-bundle 打包时，忽略 globals 中的依赖
export const external = Object.keys(globals);

// module 打包时，忽略 globals 中的依赖和其他必备依赖（下载本项目后自动下载这些必备依赖，因为 package.json 中的 dependencies 指定了这些依赖）
export const externalModule = [
  ...Object.keys(globals),
  "gray-matter",
  "markdown-it-container",
  "js-yaml",
  "picocolors",
  "tinyglobby",
  "vitepress-plugin-auto-frontmatter",
  "vitepress-plugin-catalogue",
  "vitepress-plugin-doc-analysis",
  "vitepress-plugin-file-content-loader",
  "vitepress-plugin-md-h1",
  "vitepress-plugin-permalink",
  "vitepress-plugin-permalink/usePermalink",
  "vitepress-plugin-sidebar-resolve",
  "@vue/compiler-dom",
];
