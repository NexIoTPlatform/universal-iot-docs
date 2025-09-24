import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, relative, resolve } from "node:path";
import { FilePathInfo, DocAnalysisOption } from "./types";
import matter from "gray-matter";

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = ["node_modules", "dist", ".vitepress", "public"];

/**
 * 扫描所有的 md 文件
 * @param option 配置项
 * @param prefix 指定前缀，在生成 relativePath 的时候会自动加上前缀
 */
export default (option: DocAnalysisOption = {}, prefix = ""): FilePathInfo[] => {
  const { path } = option;
  if (!path) return [];

  // 结尾必须有 /
  prefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
  // 开头不允许有 /
  prefix = prefix.replace(/^\//, "");

  return readFileList(path, option, [], prefix);
};

/**
 * 获取所有的 md 文档
 */
export function readFileList(
  root: string,
  option: DocAnalysisOption,
  fileList: FilePathInfo[] = [],
  prefix = ""
): FilePathInfo[] {
  const { path = "", ignoreList = [], ignoreIndexMd } = option;
  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];

  const secondDirOrFilenames = readdirSync(root);

  secondDirOrFilenames.forEach(dirOrFilename => {
    if (isSome(ignoreListAll, dirOrFilename)) return;

    const filePath = resolve(root, dirOrFilename);

    if (statSync(filePath).isDirectory()) {
      // 是文件夹目录
      readFileList(filePath, option, fileList, prefix);
    } else {
      // 是文件
      if (!isMdFile(dirOrFilename)) return [];
      if (ignoreIndexMd && ["index.md", "index.MD"].includes(dirOrFilename)) return [];
      // 根目录的 index.md（首页文档）不扫描
      if (filePath === resolve(path, "index.md")) return [];

      const content = readFileSync(filePath, "utf-8");
      // 解析出 frontmatter 数据
      const { data: { layout, docAnalysis } = {} } = matter(content, {});

      // 首页和手动在 frontmatter 中配置了 docAnalysis: false 的文档不纳入统计里
      if (layout === "home" || docAnalysis === false) return [];

      // 确保路径是绝对路径
      const workingDir = resolve(path);
      const absoluteFilePath = resolve(filePath);
      // 计算相对路径
      const relativePath = relative(workingDir, absoluteFilePath).replace(/\\/g, "/");
      const type = extname(dirOrFilename);

      if (type === ".md") fileList.push({ filePath, relativePath: prefix + relativePath });
    }
  });
  return fileList;
}

/**
 * 判断是否为 md 文件
 *
 * @param filePath 文件绝对路径
 */
const isMdFile = (filePath: string) => {
  return filePath.includes("md") || filePath.includes("MD");
};

/**
 * 判断数组中是否存在某个元素，支持正则表达式
 *
 * @param arr 数组
 * @param name 元素
 */
const isSome = (arr: Array<string | RegExp>, name: string) => {
  return arr.some(item => item === name || (item instanceof RegExp && item.test(name)));
};
