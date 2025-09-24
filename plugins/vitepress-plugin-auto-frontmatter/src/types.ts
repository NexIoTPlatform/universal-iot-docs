import type { GlobOptions } from "tinyglobby";

export interface AutoFrontmatterOption {
  /**
   * 扫描的文件路径表达式，为 global 表达式
   */
  pattern?: string | string[];
  /**
   * include 指定的对象如果不在 Markdown frontmatter 存在，则忽略该文件
   */
  include?: Record<string, any>;
  /**
   * exclude 指定的对象如果在 Markdown frontmatter 存在，则忽略该文件。当 include 和 exclude 存在相同文件时，exclude 优先级高
   */
  exclude?: Record<string, any>;
  /**
   * 转换处理好的 frontmatter，该函数需要返回一个新的 frontmatter 或只返回 undefined，如果返回 {}，则清空 MD 文件本身存在的 frontmatter
   */
  transform?: (frontmatter: Record<string, any>, fileInfo: FileInfo) => Record<string, any> | undefined;
  /**
   * tinyglobby 的配置项
   * 插件默认已经忽略 node_modules 和 dist 目录的所有文件
   */
  globOptions?: GlobOptions;
  /**
   * 每次启动项目时，是否基于 transform 返回的数据重新生成新的 frontmatter，如果为 false，则只对不存在的 key 进行生成，如果为 true，则重新生成新的 frontmatter
   *
   * @default false
   */
  recoverTransform?: boolean;
}

export interface FileInfo {
  /**
   * 文件绝对路径
   */
  filePath: string;
  /**
   * 文件相对路径
   */
  relativePath: string;
}
