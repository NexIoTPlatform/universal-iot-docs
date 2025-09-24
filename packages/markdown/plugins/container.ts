import type MarkdownIt from "markdown-it";
import type { ContainerLabel } from "../types";
import { createContainersThenUse } from "../helper";

/**
 * 创建 Teek 内置的 markdown-it-container 插件
 * @param md markdown-it 实例
 */
const containerPlugin = (md: MarkdownIt, containerLabel?: ContainerLabel) => {
  const markdownContainer = [
    { type: "center", useTitle: false, className: `tk-center-container` },
    { type: "right", useTitle: false, className: `tk-right-container` },
    { type: "note", useTitle: true, defaultTitle: containerLabel?.noteLabel || "NOTE", className: `custom-block` },
  ];

  createContainersThenUse(md, markdownContainer);
};

export default containerPlugin;
