export interface VpContainerProps {
  /**
   * 类型
   *
   * @default 'tip'
   */
  type?: "info" | "tip" | "warning" | "danger";
  /**
   * 标题
   */
  title?: string;
  /**
   * 文本
   */
  text?: string;
}
