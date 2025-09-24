import type { DefaultTheme } from "vitepress";

export interface SidebarOption {
  /**
   * 生成侧边栏时，忽略的文件/文件夹列表，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 .vitepress 目录层级添加，开头不需要有 /
   *
   * @default 'vitepress 的 srcDir 配置项'
   */
  path?: string;
  /**
   * 是否忽略每个目录下的 index.md 文件
   *
   * @default false
   */
  ignoreIndexMd?: boolean;
  /**
   * 是否扫描根目录下的 md 文件作为 sideBar，如果为 true，则扫描根目录下的 md 文件作为 sideBar，且忽略根目录下的 index.md
   *
   * @default true
   */
  scannerRootMd?: boolean;
  /**
   * 是否初始化第一层 items
   *
   * 假设根目录下有目录名为 guide：
   * 1、当 initItems 为 true，则最终结果为 sidebar: { "/guide": { items: [], collapsed }}
   * 2、当 initItems 为 false，则最终结果为 sidebar: { "/guide": [] }
   *
   * @default true
   */
  initItems?: boolean;
  /**
   * 是否初始化第一层 items 的 text 为当前目录名。当 initItems 为 true 时生效
   *
   * 假设根目录下有目录名为 guide，且 initItems 为 true：
   * 1、当 initItemsText 为 true，则最终结果为 sidebar: { "/guide": { text: "guide", items: [], collapsed }}
   * 2、当 initItemsText 为 false，则最终结果为 sidebar: { "/guide": { items: [] }}
   *
   * @default false
   */
  initItemsText?: boolean;
  /**
   * 是否默认折叠侧边栏，可以是 boolean 或者一个函数
   *
   * 函数的 2 个参数为：
   * 1、当前文件的相对路径（基于根目录）
   * 2、侧边栏的 text
   *
   * @default undefined
   */
  collapsed?: boolean | ((relativePath: string, text: string | undefined) => boolean);
  /**
   * 文件名前缀必须以「数字.」开头
   *
   * @default true
   */
  fileIndexPrefix?: boolean;
  /**
   * 是否从 md 文件获取第一个一级标题作为侧边栏 text
   *
   * @default false
   * @remark 侧边栏 text 获取顺序
   * titleFormMd 为 true：md 文件 formatter.title > [md 文件第一个一级标题] > md 文件名
   * titleFormMd 为 false：md 文件 formatter.title > md 文件名
   */
  titleFormMd?: boolean;
  /**
   * 当 VitePress 设置 locales 国际化后，如果将 root 语言（默认语言）的所有文件放到一个单独的目录下，如 zh，则需要将 localeRootDir 设为 zh，否则侧边栏无法知道文件都放到了 zh
   * 如果 root 语言（默认语言）的所有文件放在文档根目录下，则不需要设置 localeRootDir
   *
   * @default 文档根目录
   */
  localeRootDir?: string;
  /**
   * 解析完每个 sideBar 后的回调。每个 sideBar 指的是 SidebarOption.path 目录下的每个子目录
   *
   * @param data 当前 sideBar 列表
   * @default undefined
   */
  sideBarResolved?: (data: DefaultTheme.SidebarMulti) => DefaultTheme.SidebarMulti;
  /**
   * 解析完每个 sideBarItem 后的回调。每个 sideBarItem 指的是每个目录下的文件数组
   *
   * @param data 当前 sideBarItem 列表
   * @default undefined
   */
  sideBarItemsResolved?: (data: DefaultTheme.SidebarItem[]) => DefaultTheme.SidebarItem[];
  /**
   * 创建 sideBarItem 之前的回调。每个 sideBarItem 指的是每个目录下的文件数组
   *
   *
   * @param data 将要解析的所有文件名
   * @default undefined
   * @remark 可以过滤掉不需要解析为 sideBarItem 的文件
   */
  beforeCreateSideBarItems?: (data: string[]) => string[];
  /**
   * Markdown 文件创建或者删除时，是否重启 VitePress 服务
   *
   * @default false
   */
  restart?: boolean;
  /**
   * 忽略插件在构建侧边栏时生成的警告信息
   *
   * @default false
   */
  ignoreWarn?: boolean;
}
