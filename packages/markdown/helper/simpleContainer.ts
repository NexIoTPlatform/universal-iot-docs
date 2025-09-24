import type MarkdownIt from "markdown-it";
import type { Token } from "markdown-it/dist/index.cjs.js";
import container from "markdown-it-container";

export type ContainerArgs = [typeof container, string, { render: (tokens: Token[], idx: number) => string }];

export interface ContainerOption {
  /**
   * 容器类型
   */
  type: string;
  /**
   * 是否使用标题
   */
  useTitle?: boolean;
  /**
   * 默认标题
   */
  defaultTitle?: string;
  /**
   * 容器类名
   */
  className?: string;
}

/**
 * 创建一个自定义的容器，并使用
 *
 * @param md markdown-it 实例
 * @param option 容器配置项
 */
export const createContainerThenUse = (md: MarkdownIt, option: ContainerOption) => {
  md.use(...createContainerThenGet(md, option));
};

/**
 * 创建一个自定义的容器，并返回
 *
 * @param md markdown-it 实例
 * @param option 容器配置项
 */
export const createContainerThenGet = (md: MarkdownIt, option: ContainerOption): ContainerArgs => {
  const { type, useTitle, defaultTitle, className } = option;
  return [
    container,
    type,
    {
      render(tokens: Token[], idx: number) {
        const token = tokens[idx];
        const info = token.info.trim().slice(type.length).trim();

        if (token.nesting === 1) {
          const title = useTitle ? md.renderInline(info || defaultTitle || "") : "";
          return `<div class="${type} ${className}">${useTitle ? `<p class="title ${type}-title ${className ? `${className}-title` : ""}">${title}</p>` : ""}\n`;
        } else return `</div>\n`;
      },
    },
  ];
};

/**
 * 创建多个自定义的容器，并使用
 *
 * @param md markdown-it 实例
 * @param options 容器配置项
 */
export const createContainersThenUse = (md: MarkdownIt, options: ContainerOption[]) => {
  options.forEach(option => {
    md.use(...createContainerThenGet(md, option));
  });
};

/**
 * 创建多个自定义的容器，并返回
 *
 * @param md markdown-it 实例
 * @param options 容器配置项
 */
export const createContainersThenGet = (md: MarkdownIt, options: ContainerOption[]) => {
  const containers: ContainerArgs[] = [];

  options.forEach(option => {
    containers.push(createContainerThenGet(md, option));
  });

  return containers;
};
