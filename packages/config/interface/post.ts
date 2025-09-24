import type { TitleTagProps } from "@teek/components/common/TitleTag/src/titleTag";

export interface Post {
  /**
   * 文章模板风格，list 为列表风格，card 为卡片风格
   *
   * @since v1.1.5
   * @default list
   */
  postStyle?: "list" | "card";
  /**
   * 文章摘要位置
   *
   * @default bottom
   */
  excerptPosition?: "top" | "bottom";
  /**
   * 是否显示更多按钮
   *
   * @default true
   */
  showMore?: boolean;
  /**
   * 更多按钮文字
   *
   * @default '阅读全文 >'
   */
  moreLabel?: string;
  /**
   * 文章列表为空时的标签
   *
   * @default '暂无文章'
   */
  emptyLabel?: string;
  /**
   * 文章封面图模式
   *
   * @default 'default'
   */
  coverImgMode?: "default" | "full";
  /**
   * 是否在摘要位置显示文章部分文字，当为 true 且不使用 frontmatter.describe 和 <!-- more --> 时，会自动截取前 300 个字符作为摘要
   *
   * @default false
   */
  showCapture?: boolean;
  /**
   * 文章信息（作者、创建时间、分类、标签等信息）是否添加 | 分隔符
   *
   * @default false
   */
  splitSeparator?: boolean;
  /**
   * 是否开启过渡动画
   *
   * @default true
   */
  transition?: boolean;
  /**
   * 自定义过渡动画名称
   *
   * @default 'tk-slide-fade'
   */
  transitionName?: string;
  /**
   * 列表模式下的标题标签位置（postStyle 为 list）
   *
   * @since v1.1.5
   * @default 'right'
   */
  listStyleTitleTagPosition?: TitleTagProps["position"];
  /**
   * 卡片模式下的标题标签位置（postStyle 为 list）
   *
   * @since v1.1.5
   * @default 'left'
   */
  cardStyleTitleTagPosition?: TitleTagProps["position"];
  /**
   * 默认封面图地址，如果不设置封面图则使用默认封面图地址
   *
   * @since v1.2.1
   * @default []
   */
  defaultCoverImg?: string[];
}
