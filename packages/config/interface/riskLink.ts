export interface RiskLink {
  /**
   * 是否启用风险链接提示功能
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * 白名单，支持正则表达式
   */
  whitelist?: Array<RegExp | string>;
  /**
   * 黑名单，支持正则表达式
   *
   * @remark 如果设置了黑名单，则只拦截黑名单的链接
   */
  blacklist?: Array<RegExp | string>;
}
