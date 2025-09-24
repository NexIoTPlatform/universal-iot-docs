export interface Private {
  /**
   * 是否启用私密功能
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * 登录过期时间：1d 代表 1 天，1h 代表 1 小时，仅支持这两个单位，不加单位代表秒。过期后访问私密文章重新输入用户名和密码。默认一天
   *
   * @default '1d'
   */
  expire?: string;
  /**
   * 开启是否在网页关闭或刷新后，清除登录状态，这样再次访问网页，需要重新登录
   *
   * @default false
   */
  session?: boolean;
  /**
   * 是否使用站点级别登录功能，即第一次进入网站需要验证
   *
   * @default false
   */
  siteLogin?: boolean;
  /**
   * 站点级别登录信息，进入站点时需要认证，当 siteLogin 为 true 时生效
   */
  site?: (LoginInfo & { role?: "common" | "admin" })[];
  /**
   * 全局页面级登录信息，登录一次后其他全局页面级别的文章都可以访问
   */
  pages?: LoginInfo[];
  /**
   * 领域页面级别登录信息，登录一次后其他相同领域的文章都可以访问
   */
  realm?: { [key: string]: LoginInfo[] };
  /**
   * 输入框聚焦回调
   */
  onFocus?: (value: string, formName: "username" | "password" | "verifyCode") => void;
  /**
   * 输入框失焦回调
   */
  onBlur?: (value: string, formName: "username" | "password" | "verifyCode") => void;
  /**
   * 自定义登录逻辑，如果返回 boolean 代表自定义逻辑成功或者失败（内部会删除提示语），返回 undefined 代表结束登录逻辑
   *
   * @param nativeExecLogin 内置的登录函数，通过调用该函数来实现内置的登录功能
   */
  doLogin?: (
    loginInfo: { username: string; password: string },
    type: "site" | "pages" | "realm" | "page",
    nativeExecLogin: () => boolean
  ) => boolean | undefined;
  /**
   * 自定义验证逻辑
   *
   * @param nativeExecLogin 内置的登录函数，通过调用该函数来实现内置的登录功能
   */
  doValidate?: (
    type: "site" | "pages" | "realm" | "page",
    frontmatter: Record<string, any>,
    nativeValidate: () => boolean
  ) => boolean;
  /**
   * 自定义加密逻辑
   */
  encrypt?: (value: string, frontmatter: Record<string, any>) => string;
  /**
   * 自定义解密逻辑
   */
  decrypt?: (value: string, frontmatter: Record<string, any>) => string;
}

export interface LoginInfo {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 登录过期时间：1d 代表 1 天，1h 代表 1 小时，仅支持这两个单位，不加单位代表秒。过期后访问私密文章重新输入用户名和密码。默认一天
   *
   * @default 1d
   */
  expire?: string;
  /**
   * 开启是否在网页关闭或刷新后，清除登录状态，这样再次访问网页，需要重新登录
   *
   * @default false
   */
  session?: boolean;
  /**
   * 登录策略，once 代表一次登录，always 代表每次访问都登录
   *
   * @default 'once'
   */
  strategy?: "once" | "always";
}
