export interface TitleTagProps {
  /**
   * 内容
   */
  text?: string;
  /**
   * 类型
   */
  type?:
    | "vp-primary"
    | "vp-info"
    | "vp-success"
    | "vp-warning"
    | "vp-danger"
    | "vp-important"
    | "ep-primary"
    | "ep-info"
    | "ep-success"
    | "ep-warning"
    | "ep-danger";
  /**
   * 位置
   */
  position?: "left" | "right";
  /**
   * 大小
   */
  size?: "large" | "default" | "small" | "mini";
}
