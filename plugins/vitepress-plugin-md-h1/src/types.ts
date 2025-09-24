export interface MdH1Option {
  /**
   * 忽略的文件路径，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 添加一级标题前的钩子，如果返回 false，则不添加一级标题，如果返回 string，则使用返回值作为一级标题，string 必须是一个非空字符串
   */
  beforeInject?: (frontmatter: Record<string, any>, id: string, title: string) => boolean | string | undefined;
}
