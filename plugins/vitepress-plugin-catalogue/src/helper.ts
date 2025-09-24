import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import matter from "gray-matter";
import type { CatalogueInfo, CatalogueItem, CatalogueOption } from "./types";
import { getTitleFromMd, isIllegalIndex, isMdFile, isSome } from "./util";

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = ["node_modules", "dist", ".vitepress", "public"];

// 目录页数据
const catalogueInfo: CatalogueInfo[] = [];

export default (option: CatalogueOption = {}) => {
  const { path = "", ignoreList = [] } = option;
  if (!path) return [];

  // 获取指定根目录下的所有目录绝对路径
  const dirPaths = readDirPaths(path, ignoreList);

  // 遍历根目录下的每个子目录
  dirPaths.forEach(dirPath => scannerMdFile(dirPath, option, basename(dirPath)));

  return catalogueInfo;
};

/**
 * 指定根目录下的所有目录绝对路径，win 如 ['D:\docs\01.guide', 'D:\docs\02.design']，linux 如 ['/usr/local/docs/01.guide', '/usr/local/docs/02.design']
 * @param sourceDir 指定文件/文件夹的根目录
 */
const readDirPaths = (sourceDir: string, ignoreList: CatalogueOption["ignoreList"] = []) => {
  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];
  const dirPaths: string[] = [];
  // 读取目录，返回数组，成员是 root 下所有的目录名（包含文件夹和文件，不递归）
  const dirOrFilenames = readdirSync(sourceDir);

  dirOrFilenames.forEach(dirOrFilename => {
    // 将路径或路径片段的序列解析为绝对路径，等于使用 cd 命令
    const secondDirPath = resolve(sourceDir, dirOrFilename);
    // 是否为文件夹目录，并排除指定文件夹
    if (!isSome(ignoreListAll, dirOrFilename) && statSync(secondDirPath).isDirectory()) {
      dirPaths.push(secondDirPath);
    }
  });

  return dirPaths;
};

/**
 * 递归扫描指定目录下所有的 md 文件
 * @param root 指定目录
 * @param option 配置项
 * @param prefix 目录前缀，每次递归都加前端目录名
 */
const scannerMdFile = (root: string, option: CatalogueOption, prefix = "") => {
  const { path: srcDir = "", ignoreList = [] } = option;
  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];
  // 读取目录名（文件和文件夹）
  const dirOrFilenames = readdirSync(root);

  dirOrFilenames.forEach(dirOrFilename => {
    if (isSome(ignoreListAll, dirOrFilename)) return [];

    const filePath = resolve(root, dirOrFilename);

    if (statSync(filePath).isDirectory()) {
      // 是文件夹目录
      scannerMdFile(filePath, option, `${prefix}/${dirOrFilename}`);
    } else {
      // 是文件
      if (!isMdFile(dirOrFilename)) return;

      const content = readFileSync(filePath, "utf-8");
      // 解析出 frontmatter 数据
      const { data: { catalogue, path = "" } = {} } = matter(content, {});

      if (catalogue && path) {
        const filename = basename(dirOrFilename, extname(dirOrFilename));

        catalogueInfo.push({
          filePath: `${prefix}/${filename}`,
          path,
          catalogues: createCatalogueList(join(srcDir, path), option, `/${path}/`),
        });
      }
    }
  });
};

/**
 * 扫描指定目录下的子目录和文件，生成目录页数据
 * @param root 指定目录
 * @param option 配置项
 * @param prefix 目录前缀，每次递归都加前端目录名
 */
const createCatalogueList = (root: string, option: CatalogueOption, prefix = "/"): CatalogueItem[] => {
  if (!existsSync(root)) {
    console.warn(`'${root}' 路径不存在，将忽略该目录页的生成`);
    return [];
  }

  const { ignoreIndexMd = false, titleFormMd = false } = option;

  const catalogueItemList: CatalogueItem[] = [];
  // 存放没有序号的目录页
  const catalogueItemListNoIndex: CatalogueItem[] = [];
  const dirOrFilenames = readdirSync(root);

  dirOrFilenames.forEach(dirOrFilename => {
    const filePath = resolve(root, dirOrFilename);
    const { index: indexStr, title, name } = resolveFileName(dirOrFilename, filePath);
    const index = parseInt(indexStr as string, 10);

    if (statSync(filePath).isDirectory()) {
      // 是文件夹目录
      const mdTitle = titleFormMd ? tryGetMdTitle(root, dirOrFilename) : "";

      const catalogueItem = {
        title: mdTitle || title,
        children: createCatalogueList(filePath, option, `${prefix}${dirOrFilename}/`),
        frontmatter: {},
      };

      if (isIllegalIndex(index)) catalogueItemListNoIndex.push(catalogueItem);
      else catalogueItemList[index] = catalogueItem;
    } else {
      // 是文件
      if (!isMdFile(dirOrFilename)) return [];
      if (ignoreIndexMd && ["index.md", "index.MD"].includes(dirOrFilename)) return [];

      const content = readFileSync(filePath, "utf-8");
      // 解析出 frontmatter 数据
      const { data: frontmatter = {}, content: mdContent } = matter(content, {});
      const { title: frontmatterTitle, catalogue, inCatalogue = true } = frontmatter;

      // 不扫描目录页和 inCatalogue 为 false 的文档
      if (catalogue || !inCatalogue) return [];

      // title 获取顺序：md 文件 formatter.title > md 文件一级标题 > md 文件名
      const mdTitle = titleFormMd ? getTitleFromMd(mdContent) : "";
      const finalTitle = frontmatterTitle || mdTitle || title;

      const catalogueItem = {
        title: finalTitle,
        link: prefix + name,
        frontmatter,
      };

      if (isIllegalIndex(index)) catalogueItemListNoIndex.push(catalogueItem);
      else catalogueItemList[index] = catalogueItem;
    }
  });

  // 将没有序号的 catalogueItemsNoIndex 放到最后面
  return [...catalogueItemList, ...catalogueItemListNoIndex].filter(Boolean);
};

/**
 * 解析文件名，返回文件序号、文件标题、文件类型
 * @param filename 文件名
 * @param filePath 文件绝对路径
 */
const resolveFileName = (
  filename: string,
  filePath: string
): { index: string | number; title: string; type: string; name: string } => {
  const stat = statSync(filePath);
  // 文件序号
  let index: string | number = "";
  // 文章标题，如果为目录，则默认为文件夹名。如果为 md 文件，则尝试获取 frontmatter 中的 title，否则为文件名为标题
  let title = "";
  // 文件类型
  let type = "";
  // 文件名称，不带后缀
  let name = "";

  /**
   * 如果 filename 为 1.Ke.md，则解析为 ['1', 'Ke', 'md']，其中 index 为 1，title 为 Ke，type 为 md
   * 如果 filename 为 1.Ke.d.md，则解析为 ['1', 'Ke.d', 'md']，其中 index 为 1，title 为 Ke.d，type 为 md
   */
  const fileNameArr = filename.split(".");

  if (fileNameArr.length === 2) {
    // index.md 文件的下标默认为 0，则永远在侧边栏的第一位
    index = fileNameArr[0] === "index" ? "0" : fileNameArr[0];
    title = stat.isDirectory() ? fileNameArr[1] : fileNameArr[0];
    type = fileNameArr[1];
    name = fileNameArr[0];
  } else {
    const firstDotIndex = filename.indexOf(".");
    const lastDotIndex = filename.lastIndexOf(".");
    index = filename.substring(0, firstDotIndex);
    type = filename.substring(lastDotIndex + 1);
    name = filename.substring(0, lastDotIndex);

    if (stat.isDirectory()) title = filename.substring(firstDotIndex + 1);
    else title = filename.substring(firstDotIndex + 1, lastDotIndex);
  }

  return { index, title, type, name };
};

/**
 * 按顺序从该目录下的 [index.md, index.MD, 目录名.md] 文件获取标题，一旦获取到第一个则不再继续遍历
 * @param root 目录绝对路径
 * @param dirOrFilename 文件夹名
 */
const tryGetMdTitle = (root: string, dirOrFilename: string) => {
  const filePaths = [
    join(root, dirOrFilename, "index.md"),
    join(root, dirOrFilename, "index.MD"),
    join(root, dirOrFilename, dirOrFilename + ".md"),
  ];

  for (const filePath of filePaths) {
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, "utf-8");
    const { content: mdContent } = matter(content, {});
    const t = getTitleFromMd(mdContent);

    if (t) return t;
  }

  return "";
};
