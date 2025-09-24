export interface PageCardProps {
  /**
   * 标题
   */
  title?: string;
  /**
   * 标题链接，如果是 http/https 等协议带头，则跳转新窗口，否则在当前窗口跳转
   */
  titleLink?: string;
  /**
   * 标题点击事件，优先级低于 titleLink
   */
  titleClick?: () => void;
  /**
   * 是否开启分页功能
   *
   * @default false
   */
  page?: boolean;
  /**
   * 每页显示数量
   *
   * @default 4
   */
  pageSize?: number;
  /**
   * 总数量
   *
   * @default 0
   */
  total?: number;
  /**
   * 是否开启自动分页
   *
   * @default false
   */
  autoPage?: boolean;
  /**
   * 翻页间隔时间，单位：毫秒，仅当 autoPage 为 true 生效
   *
   * @default 400
   */
  pageSpeed?: number;
}
