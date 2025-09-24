import type { TeekConfig } from "@teek/config";
import type { BaiduAnalyticsOptions, GoogleAnalyticsOptions, UmamiAnalytics } from "@teek/helper";
import DefaultTheme from "vitepress/theme";
import { isClient, baiduAnalytics, trackPageview, googleAnalytics, umamiAnalytics } from "@teek/helper";
import {
  TeekConfigProvider,
  TkLayout,
  TkCataloguePage,
  TkArchivesPage,
  TkDemoCode,
  TkArticleOverviewPage,
  TkTitleTag,
  TkIcon,
  TkLoginPage,
  TkRiskLinkPage,
} from "@teek/components";

import "../theme-chalk/src/index.scss";

export type DefaultThemeType = typeof DefaultTheme;
export type * from "@teek/config";

export * from "@teek/static";
export * from "@teek/components";
export * from "@teek/helper";
export * from "@teek/composables";
export * from "@teek/locale";
export * from "@teek/markdown/helper";
export * from "./version";

export default {
  extends: DefaultTheme,
  Layout: TeekConfigProvider(TkLayout),
  enhanceApp({ app, siteData }) {
    app.component("TkCataloguePage", TkCataloguePage);
    app.component("TkArchivesPage", TkArchivesPage);
    app.component("TkArticleOverviewPage", TkArticleOverviewPage);
    app.component("TkLoginPage", TkLoginPage);
    app.component("TkRiskLinkPage", TkRiskLinkPage);
    app.component("TkDemoCode", TkDemoCode);
    app.component("TkTitleTag", TkTitleTag);
    app.component("TkIcon", TkIcon);

    // 站点分析
    const siteAnalytics = (siteData.value.themeConfig.siteAnalytics as TeekConfig["siteAnalytics"]) || [];
    const siteAnalysis: Record<string, (options: any) => void> = {
      baidu: (options: BaiduAnalyticsOptions) => {
        baiduAnalytics(options);
        if (isClient) trackPageview(options, window.location.href);
      },
      google: (options: GoogleAnalyticsOptions) => googleAnalytics(options),
      umami: (options: UmamiAnalytics) => umamiAnalytics(options),
    };

    siteAnalytics.forEach(item => {
      siteAnalysis[item.provider]?.(item.options);
    });
  },
} as DefaultThemeType & { extends: DefaultThemeType };
