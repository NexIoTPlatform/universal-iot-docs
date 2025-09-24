export interface ArticleUpdate {
  /**
   * 是否启用文章最近更新栏
   *
   * @since v1.2.1
   * @default true
   */
  enabled?: boolean;
  /**
   * 文章最近更新栏显示数量
   *
   * @since v1.2.1
   * @default 3
   */
  limit?: number;
}
