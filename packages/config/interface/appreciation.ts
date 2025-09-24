import type { IconProps } from "@teek/components/common/Icon/src/icon";

export type Appreciation<T extends keyof AppreciationPosition = ""> = {
  /**
   * 赞赏位置
   */
  position: T;
  /**
   * 赞赏配置
   */
  options?: AppreciationPosition[T];
};

export type AppreciationPosition = {
  "": object;
  "aside-bottom": {
    /**
     * 赞赏标题，支持 HTML
     */
    title?: string;
    /**
     * 赞赏内容，支持 HTML
     */
    content?: string;
  };
  "doc-after": {
    /**
     * 自定义按钮 HTML
     */
    buttonHtml?: string;
    /**
     * 赞赏图标，内置 weChatPay 和 alipay
     */
    icon?: IconProps["icon"] | "weChatPay" | "alipay";
    /**
     * 展开标题，支持 HTML
     */
    expandTitle?: string;
    /**
     * 折叠标题，支持 HTML
     */
    collapseTitle?: string;
    /**
     * 赞赏内容，支持 HTML
     */
    content?: string;
    /**
     * 是否默认展开
     *
     * @default false
     */
    expand?: boolean;
  };
  "doc-after-popper": {
    /**
     * 触发方式
     *
     * @default "click"
     */
    trigger?: "click" | "hover";
    /**
     * 自定义按钮 HTML
     */
    buttonHtml?: string;
    /**
     * 赞赏图标，内置 weChatPay 和 alipay
     */
    icon?: IconProps["icon"] | "weChatPay" | "alipay";
    /**
     * 赞赏标题，支持 HTML
     */
    title?: string;
    /**
     * 赞赏内容，支持 HTML
     */
    content?: string;
  };
};
