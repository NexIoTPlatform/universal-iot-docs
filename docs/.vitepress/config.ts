import { defineConfig } from "vitepress";
// 本地 Teek 主题包引用（与 Teek 在线主题包引用 二选一）
import { defineTeekConfig } from "../../packages/config";
import { version } from "../../packages/teek/version";

// Teek 在线主题包引用（需安装 Teek 在线版本）
// import { defineTeekConfig } from "vitepress-theme-teek/config";
// import { version } from "vitepress-theme-teek/es/version";

const description = [
  "欢迎来到 vitepress-theme-teek 使用文档",
  "Teek 是一款基于 VitePress 构建的主题，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置",
  "Teek 拥有三种典型的知识管理形态：结构化、碎片化、体系化，可以轻松构建一个结构化知识库，适用个人博客、文档站、知识库等场景",
].toString();

const teekConfig = defineTeekConfig({
  author: { name: "nexiot", link: "https://github.com/Kele-Bingtang" },
  blogger: {
    avatar: "/avator.png",
    shape: "circle-rotate",
    name: "nexiot",
    slogan: "兴趣，坚持，热爱，专注",
    circleBgImg: "/blog/bg4.webp",
    color: "#ffffff",
  },
  footerInfo: {
    theme: {
      name: `Theme By Teek@${version}`,
    },
    copyright: {
      createYear: 2025,
      suffix: "Teek",
    },
  },
  codeBlock: {
    copiedDone: TkMessage => TkMessage.success("复制成功！"),
    collapseHeight: false, // 禁用代码块自动折叠
    disabled: false, // 禁用代码块
  },
  post: {
    showCapture: true,
  },
  articleShare: { enabled: true },
  vitePlugins: {
    sidebarOption: {
      initItems: false,
    },
  },
  markdown: {
    demo: {
      githubUrl: "https://nexiotplatform.github.io/universal-iot-docs/",
    },
  },
  siteAnalytics: [
    {
      provider: "baidu",
      options: {
        id: "739869837cf16cb1c38dfdccea3ad1b9",
      },
    },
    {
      provider: "google",
      options: {
        id: "G-K5GNDW3L7K",
      },
    },
  ],
  themeEnhance: {
    // 启用布局切换，默认“全部展开”，并允许调整最大宽度
    layoutSwitch: {
      disabled: false,
      defaultMode: "fullWidth",
      disableAnimation: false,
    },
    themeColor: {
      disabled: true,
    },
    spotlight: {
      disabled: true,
    },
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  title: "奈科斯（NexIoT）",
  description: description,
  base: process.env.CF_PAGES ? "/" : "/universal-iot-docs/",
  cleanUrls: false,
  lastUpdated: true,
  lang: "zh-CN",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/teek-logo-mini.svg" }],
    ["link", { rel: "icon", type: "image/png", href: "/teek-logo-mini.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:title", content: "Teek | VitePress Theme" }],
    ["meta", { property: "og:site_name", content: "Teek" }],
    ["meta", { property: "og:image", content: "" }],
    ["meta", { property: "og:url", content: "" }],
    ["meta", { property: "og:description", description }],
    ["meta", { name: "description", description }],
    ["meta", { name: "author", content: "Teek" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],

    ["meta", { name: "keywords", description }],
    ["meta", { name: "baidu-site-verification", content: "codeva-GdK2q9MO1i" }], // 百度收录
    ["meta", { name: "msvalidate.01", content: "48CABE70F538B8D117567176ABF325AF" }], // Bing 收录验证
    ["script", { charset: "UTF-8", id: "LA_COLLECT", src: "//sdk.51.la/js-sdk-pro.min.js" }], // 51.la
    [
      "script",
      {},
      `typeof LA !== 'undefined' && LA.init({ id: "3LqfP8Icg0GeEvtn", ck: "3LqfP8Icg0GeEvtn", hashMode: true })`,
    ], // 51.la
  ],
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  sitemap: {
    hostname: process.env.CF_PAGES
      ? process.env.CF_PAGES_URL || "https://universal-iot-docs.pages.dev"
      : "https://phoenixhai.github.io/universal-iot-docs",
    transformItems: items => {
      const permalinkItemBak: typeof items = [];
      // 使用永久链接生成 sitemap
      const permalinks = (globalThis as any).VITEPRESS_CONFIG.site.themeConfig.permalinks;
      items.forEach(item => {
        const permalink = permalinks?.map[item.url];
        if (permalink) permalinkItemBak.push({ url: permalink, lastmod: item.lastmod });
      });
      return [...items, ...permalinkItemBak];
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/teek-logo-mini.svg",
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新时间",
    outline: {
      level: [2, 4],
      label: "本页导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    nav: [
      { text: "首页", link: "/" },
      {
        text: "平台介绍",
        link: "/guide/intro",
        activeMatch: "/01.平台介绍/",
      },
      { 
        text: "设备接入", 
        activeMatch: "/02.设备接入/",
        items: [
          { text: "TCP设备接入", link: "/iot/tcp/prepare" },
          { text: "MQTT设备接入", link: "/iot/mqtt/important-notice" },
          { text: "天翼物联接入", link: "/iot/aiot/create-product" },
          { text: "HTTP设备接入", link: "/iot/http/api-specification" },
          { text: "移动OneNET接入", link: "/iot/onenet/overview" },
          { text: "云云对接接入", link: "/iot/cloud-cloud/overview" },
        ]
      },
      {
        text: "视频教程",
        items: [
          { text: "总览", link: "/tutorials" },
          { text: "天翼物联实战", link: "/iot/aiot/create-product" },
          { text: "MQTT直连接入", link: "/iot/mqtt/important-notice" },
          { text: "TCP直连接入", link: "/iot/tcp/prepare" }
        ]
      },
      {
        text: "产品动态",
        items: [
          { 
            text: "系统更新日志", 
            link: "/04.系统更新日志/01.版本历史/01.最新版本",
            activeMatch: "/04.系统更新日志/"
          },
          { 
            text: "发展路线图", 
            link: "/05.发展路线图/01.产品愿景/01.产品定位",
            activeMatch: "/05.发展路线图/"
          },
          { 
            text: "案例分享", 
            link: "/06.案例分享/01.成功案例/01.企业级部署",
            activeMatch: "/06.案例分享/"
          },
        ]
      },
      {
        text: "演示地址",
        items: [
          { 
            text: "平台演示", 
            link: "http://iot.192886.xyz:81/",
            target: "_blank"
          },
          { 
            text: "调试IDE", 
            link: "http://iot.192886.xyz:81/magic/debug/index.html",
            target: "_blank"
          }
        ]
      },
      {
        text: "企业授权",
        // 与"设备接入"一致：activeMatch 指向实际目录
        activeMatch: "/08.版本对比/",
        items: [
          { text: "功能对比", link: "/versions/comparison" },
          { text: "商业授权", link: "/versions/plugins" },
          { text: "授权说明", link: "/versions/license-terms" }
        ]
      },
      {
        text: "产品库",
        activeMatch: "/examples/productLibrary/",
        items: [
          { text: "完成对接", link: "/examples/productLibrary/" },
        ]
      },
    ],
    socialLinks: [
      {
        icon: "gitee", link: "https://gitee.com/NexIoT/Universal-IoT-Java" 
       },
      {
       icon: "github", link: "https://github.com/NexIoTPlatform/Universal-IoT-Java" 
      }
   
      ],
    search: {
      provider: "local",
    },
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/NexIoTPlatform/Universal-IoT-Docs/edit/master/docs/:path",
    },
  },
});
