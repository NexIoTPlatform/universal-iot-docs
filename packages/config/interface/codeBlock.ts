import type { Message } from "@teek/components/common/Message/src/message";

export interface CodeBlock {
  /**
   * 是否禁用新版代码块
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * 超出高度后自动折叠，设置 true 则默认折叠，false 则默认不折叠
   *
   * @default 700
   */
  collapseHeight?: number | boolean;
  /**
   * 复制代码完成后的回调
   */
  copiedDone?: (TkMessage: Message) => void;
}
