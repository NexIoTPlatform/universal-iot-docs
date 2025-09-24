export interface CatalogueOption {
  /**
   * 忽略的文件/文件夹列表，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 .vitepress 目录层级添加
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
   * 控制是否从 md 文件获取第一个一级标题作为侧边栏 text
   *
   * @default false
   * @remark 侧边栏 text 获取顺序
   * titleFormMd 为 true：md 文件 formatter.title > [md 文件第一个一级标题] > md 文件名
   * titleFormMd 为 false：md 文件 formatter.title > md 文件名
   */
  titleFormMd?: boolean;
}

export interface Catalogue {
  /**
   * 目录页数据，map 和 inv 都是由 arr 转换得来的
   */
  arr: CatalogueInfo[];
  /**
   * key 为文件相对路径，value 为 { path：扫描的目录页路径, catalogues：目录页数据 }
   */
  map: {
    [key: string]: { path: string; catalogues: CatalogueItem[] };
  };
  /**
   * key 为 path：扫描的目录页路径文，value 为 { path：件相对路径, catalogues：目录页数据 }
   */
  inv: {
    [key: string]: { filePath: string; catalogues: CatalogueItem[] };
  };
}

export interface CatalogueInfo {
  /**
   * 文件相对路径
   */
  filePath: string;
  /**
   * 要扫描的目录路径
   */
  path: string;
  /**
   * 目录页数据
   */
  catalogues?: CatalogueItem[];
}

export interface CatalogueItem {
  /**
   * 文件名称
   */
  title: string;
  /**
   * 文件 frontmatter
   */
  frontmatter: Record<string, any>;
  /**
   * 文件路径
   */
  link?: string;
  /**
   * 子目录
   */
  children?: CatalogueItem[];
}
