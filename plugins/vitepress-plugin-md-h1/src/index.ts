import type { Plugin } from "vite";
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { MdH1Option } from "./types";
import { EOL } from "node:os";

export * from "./types";

export default function VitePluginVitePressMdH1(option: MdH1Option = {}): Plugin & { name: string } {
  return {
    name: "vite-plugin-vitepress-md-h1",
    load: (id: string) => {
      if (!id.endsWith(".md") || !existsSync(id)) return;

      const { ignoreList = [], beforeInject } = option;

      if (isSome(ignoreList, id)) return;

      const content = readFileSync(id, "utf-8");
      const { data: frontmatter = {}, content: mdContent } = matter(content, {});

      if (frontmatter.autoTitle === undefined && ![undefined, "doc"].includes(frontmatter.layout)) return;
      if (frontmatter.autoTitle === false) return;
      // 如果已经存在一级标题，则不需要往下处理
      if (mdContent.trimStart().split(/\r?\n/)[0].startsWith("# ")) return;

      let title = frontmatter.title || getMdFileTitle(basename(id)) || "";

      // 添加一级标题前执行 beforeInject 钩子
      if (beforeInject && typeof beforeInject === "function") {
        const result = beforeInject(frontmatter, id, title);

        if (result === false) return;
        if (typeof result === "string") title = result;
      }

      // 换行两次
      const newTwoLine = EOL + EOL;

      if (content.trimStart().startsWith("---")) {
        // 在第二个 --- 下添加 title
        return content.replace(/^(\s*---[\s\S]*?---)/, `$1${newTwoLine}# ${title}${newTwoLine}`);
      }

      return `# ${title}${newTwoLine}${content}`;
    },
  };
}

/**
 * 获取实际的文件名
 *
 * @param filename 文件名
 */
export const getMdFileTitle = (filename: string) => {
  let title = "";
  // 如果文件名带序号，如【1.xx.md】，则取 xx
  const fileNameArr = filename.split(".");

  if (fileNameArr.length === 2) title = fileNameArr[0];
  else {
    // 处理多个 . 如 01.guile.md 的情况
    const firstDotIndex = filename.indexOf(".");
    const lastDotIndex = filename.lastIndexOf(".");
    title = filename.substring(firstDotIndex + 1, lastDotIndex);
  }

  return title;
};

/**
 * 判断数组中是否存在某个元素，支持正则表达式
 *
 * @param arr 数组
 * @param name 元素
 */
const isSome = (arr: Array<string | RegExp>, name: string) => {
  return arr.some(
    item => (typeof item === "string" && name.includes(item)) || (item instanceof RegExp && item.test(name))
  );
};
