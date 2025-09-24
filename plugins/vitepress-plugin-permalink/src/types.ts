export interface PermalinkOption {
  /**
   * 忽略的文件/文件夹列表，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 .vitepress 目录层级添加，开头不需要有 /
   * @default 'vitepress 的 srcDir 配置项'
   */
  path?: string;
}

export interface NotFoundOption {
  /**
   * 404 页面延迟加载时间，单位为毫秒，仅限第一次进入页面或刷新/回退/前进页面生效
   *
   * VP 404 页面兼容 permalink 插件，因为 permalink 插件支持自定义 URL，但是 VP 初始化页面时根据自定义 URL 寻找文档会 404，因此需要延迟时间来给 permalink 插件寻找正确的文档路径
   * 如果发现刷新页面有 404 页面短暂出现，则将 notFoundDelayLoad 配置项的时间调大
   *
   * @default 500
   */
  notFoundDelayLoad?: number;
}

export interface Permalink {
  /**
   * key 为文件相对路径，value 为永久链接
   */
  map: Record<string, string>;
  /**
   * key 为永久链接，value 为文件相对路径
   */
  inv: Record<string, string>;
}
