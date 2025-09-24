// 该文件已经不再使用，这是插件的第一版，基于 transform 钩子实现添加一级标题功能，第二版使用 load 钩子，请看 ./index.ts

import type { Plugin } from "vite";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { MdH1Option } from "./types";

export * from "./types";

const multipleBlockTag = `return (_openBlock(), _createElementBlock("div", null, [`;
const singleBlockTag = `return (_openBlock(), _createElementBlock("div", null, _cache[0] || (_cache[0] = [`;
const createStaticVNodeTag = `_createStaticVNode("`;
const createTextVNode = "createTextVNode as _createTextVNode";

export default function VitePluginVitePressMdH1(option: MdH1Option = {}): Plugin & { name: string } {
  return {
    name: "vite-plugin-vitepress-md-h1",
    transform: (code: string, id: string) => {
      if (!id.endsWith(".md")) return code;

      const { ignoreList = [], beforeInject } = option;

      if (isSome(ignoreList, id)) return code;

      const content = readFileSync(id, "utf-8");
      const { data: frontmatter = {}, content: mdContent } = matter(content, {});

      // 如果已经存在一级标题，则不需要往下处理
      if (mdContent.trimStart().split(/\r?\n/)[0].startsWith("# ")) return code;
      // 获取文章标题，如果为目录，则默认为文件夹名。如果为 md 文件，则尝试获取 frontmatter 中的 title，否则为文件名为标题
      let title = frontmatter.title || getMdFileTitle(basename(id)) || "";

      // 添加一级标题前执行 beforeInject 钩子
      if (beforeInject && typeof beforeInject === "function") {
        const result = beforeInject(frontmatter, id, title);

        if (result === false) return;
        if (typeof result === "string") title = result;
      }

      const titleId = formatSpecialStr(title);

      // 将 " 替换为 \"，因为 " 会导致页面解析失败
      const finalTitle = title.replace(/"+/g, '\\"');

      if (code.includes(multipleBlockTag)) {
        // 第一个 replace 先将 _cache 的下标加 1，第二个 replace 把 h1 标题加到 _cache[0] 里
        return code
          .replace(/_cache\[(\d+)\]/g, (_, p1) => {
            const newIndex = parseInt(p1, 10) + 1;
            return `_cache[${newIndex}]`;
          })
          .replace(
            multipleBlockTag,
            `${multipleBlockTag}
              _cache[0] || (_cache[0] = _createStaticVNode("<h1 id=\\"${titleId}\\" tabindex=\\"-1\\">${finalTitle} <a class=\\"header-anchor\\" href=\\"#${titleId}\\" aria-label=\\"Permalink to &quot;${finalTitle}&quot;\\" /></h1>", 1)),
            `
          );
      }

      if (code.includes(singleBlockTag)) {
        const newCode = code.replace(
          singleBlockTag,
          `${singleBlockTag}
              _createElementVNode("h1", {
                id: "${titleId}",
                tabindex: "-1"
              }, [
                _createTextVNode("${finalTitle} "),
                _createElementVNode("a", {
                  class: "header-anchor",
                  href: "#${titleId}",
                  "aria-label": "Permalink to \\"${finalTitle}\\""
                }, "")
              ], -1 /* HOISTED */),
            `
        );

        if (newCode.includes(createTextVNode)) return newCode;
        // 如果没有引入 createTextVNode，则手动引入
        return newCode.replace("import {", `import { ${createTextVNode},`);
      }

      if (code.includes(createStaticVNodeTag)) {
        return code.replace(
          createStaticVNodeTag,
          `${createStaticVNodeTag}<h1 id=\\"${titleId}\\" tabindex=\\"-1\\">${finalTitle} <a class=\\"header-anchor\\" href=\\"#${titleId}\\" aria-label=\\"Permalink to &quot;${finalTitle}&quot;\\" /></h1>`
        );
      }

      return code;
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
 * 格式化字符串
 * @param str 字符串
 */
export const formatSpecialStr = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[\s+]/g, "") // 清除空格
    .replace(/['"`*]+/g, ""); // 去除反引号、星号等 Markdown 语法字符
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
