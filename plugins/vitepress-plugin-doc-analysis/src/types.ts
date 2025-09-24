export interface DocAnalysisOption {
  /**
   * 忽略的文件/文件夹列表，支持正则表达式
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
   * 1 分钟内阅读的中文字数
   *
   * @default 300
   */
  cn?: number;
  /**
   * 1 分钟内阅读的英文字数
   *
   * @default 160
   */
  en?: number;
  /**
   * 自定义函数来返回额外的文件信息，最终存放到 fileInfo 里
   *
   * @param filePath 文件路径信息
   */
  transformFile?: (filePath: FilePathInfo) => Record<string, any> | undefined;
}

export interface DocAnalysis {
  /**
   * 文件路径列表
   */
  fileList: FilePathInfo[];
  /**
   * 文件总共字数
   */
  totalFileWords: number;
  /**
   * 文件信息列表
   */
  eachFileWords: FileInfo[];
  /**
   * git 上次 commit 时间
   */
  lastCommitTime: string;
}

export interface FileInfo {
  /**
   * 文件路径
   */
  fileInfo: FilePathInfo;
  /**
   * 字数
   */
  wordCount: number;
  /**
   * 阅读时间
   */
  readingTime: string;
  /**
   * 文件 frontmatter 数据
   */
  frontmatter: Record<string, any>;
}

export interface FilePathInfo {
  /**
   * 文件绝对路径
   */
  filePath: string;
  /**
   * 文件相对路径
   */
  relativePath: string;
  /**
   * 通过 transformFile 配置项得到的其他信息
   */
  [key: string]: any;
}
