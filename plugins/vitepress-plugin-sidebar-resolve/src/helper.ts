import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, basename, resolve } from "node:path";
import matter from "gray-matter";
import type { DefaultTheme } from "vitepress";
import type { SidebarOption } from "./types";
import { getTitleFromMd, isIllegalIndex, isSome } from "./util";
import logger from "./log";

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = ["node_modules", "dist", ".vitepress", "public"];

/**
 * 生成侧边栏数据
 * @param  option 配置项
 * @param prefix 指定前缀，在生成侧边栏的 link 时，会自动加上前缀
 */
export default (option: SidebarOption = {}, prefix = "/"): DefaultTheme.SidebarMulti => {
  const {
    path,
    ignoreList = [],
    scannerRootMd = true,
    collapsed,
    titleFormMd = false,
    initItems = true,
    initItemsText = false,
    sideBarResolved,
    ignoreWarn = false,
  } = option;
  if (!path) return {};

  // 确保 prefix 始终都有 / 结尾
  prefix = prefix.replace(/\/$/, "") + "/";

  const sidebar: DefaultTheme.SidebarMulti = {};
  // 获取指定根目录下的所有目录绝对路径
  const dirPaths = readDirPaths(path, ignoreList);

  // 只扫描根目录的 md 文件，且不扫描 index.md（首页文档）
  const key = prefix === "/" ? prefix : `/${prefix}`;
  if (scannerRootMd) sidebar[key] = createSideBarItems(path, { ...option, ignoreIndexMd: true }, key, scannerRootMd);

  // 遍历根目录下的每个子目录，生成对应的侧边栏数据
  dirPaths.forEach(dirPath => {
    // dirPath 是每个目录的绝对路径
    const fileName = basename(dirPath);

    // 创建 SideBarItems
    const sidebarItems = createSideBarItems(dirPath, option, `${key}${fileName}/`);

    if (!ignoreWarn && !sidebarItems.length) {
      return logger.warn(`该目录 '${dirPath}' 内部没有任何文件或文件序号出错，将忽略生成对应侧边栏`);
    }

    const { name, title } = resolveFileName(fileName, dirPath);
    const mdTitle = titleFormMd ? tryGetMdTitle(dirPath, fileName) : "";
    const text = initItemsText ? mdTitle || title : undefined;

    sidebar[`${key}${fileName}/`] = initItems
      ? [
          {
            text,
            collapsed: typeof collapsed === "function" ? collapsed(prefix + name, text) : collapsed,
            items: sidebarItems,
          },
        ]
      : sidebarItems;
  });

  return sideBarResolved?.(sidebar) ?? sidebar;
};

/**
 * 指定根目录下的所有目录绝对路径，win 如 ['D:\docs\01.guide', 'D:\docs\02.design']，linux 如 ['/usr/local/docs/01.guide', '/usr/local/docs/02.design']
 * @param sourceDir 指定文件/文件夹的根目录
 */
const readDirPaths = (sourceDir: string, ignoreList: SidebarOption["ignoreList"] = []) => {
  const dirPaths: string[] = [];
  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];
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
 * 将目录映射为对应的侧边栏配置数据，处理成 VitePress 格式
 *
 * @param root 文件/文件夹的根目录绝对路径
 * @param option 配置项
 * @param prefix 记录的文件/文件夹路径（包含刚进入方法时的 root 目录），确保 prefix 始终都有 / 结尾
 * @param onlyScannerRootMd 是否只扫描根目录下的 md 文件，如果为 false，则只递归扫描根目录下的所有子目录文件（不包含根目录文件），如果为 true，则只扫描根目录的文件
 */
const createSideBarItems = (
  root: string,
  option: SidebarOption,
  prefix = "/",
  onlyScannerRootMd = false
): DefaultTheme.SidebarItem[] => {
  const {
    collapsed,
    ignoreList = [],
    ignoreIndexMd = false,
    fileIndexPrefix = false,
    sideBarItemsResolved,
    beforeCreateSideBarItems,
    titleFormMd = false,
    ignoreWarn = false,
  } = option;
  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];

  // 结构化文章侧边栏数据，以文件夹的序号为数字下标
  let sidebarItems: DefaultTheme.SidebarItem[] = [];
  // 存储没有序号的文件，最终生成 sidebarItems 的时候，将这些文件放到最后面
  const sidebarItemsNoIndex: DefaultTheme.SidebarItem[] = [];
  // 读取目录名（文件和文件夹）
  let dirOrFilenames = readdirSync(root);

  dirOrFilenames = beforeCreateSideBarItems?.(dirOrFilenames) ?? dirOrFilenames;

  dirOrFilenames.forEach(dirOrFilename => {
    if (isSome(ignoreListAll, dirOrFilename)) return [];

    const filePath = resolve(root, dirOrFilename);
    // 解析文件名
    const { index: indexStr, title, type, name } = resolveFileName(dirOrFilename, filePath);
    // 十进制转换
    const index = parseInt(indexStr as string, 10);

    // 校验文件序号
    if (!ignoreWarn && fileIndexPrefix && isIllegalIndex(index)) {
      logger.warn(`该文件 '${filePath}' 序号出错，请填写正确的序号`);
      return [];
    }

    // 判断序号是否已经存在
    if (!ignoreWarn && sidebarItems[index]) logger.warn(`该文件 '${filePath}' 的序号在同一级别中重复出现，将会被覆盖`);

    if (!onlyScannerRootMd && statSync(filePath).isDirectory()) {
      // 是文件夹目录
      const mdTitle = titleFormMd ? tryGetMdTitle(root, dirOrFilename) : "";
      const text = mdTitle || title;

      const sidebarItem = {
        text,
        collapsed: typeof collapsed === "function" ? collapsed(prefix + name, text) : collapsed,
        items: createSideBarItems(filePath, option, `${prefix}${dirOrFilename}/`),
      };

      if (isIllegalIndex(index)) sidebarItemsNoIndex.push(sidebarItem);
      else sidebarItems[index] = sidebarItem;
    } else {
      // 是文件
      // 开启只扫描根目录 md 文件时，不扫描 index.md（首页文档）
      if (onlyScannerRootMd && dirOrFilename === "index.md") return [];
      if (ignoreIndexMd && ["index.md", "index.MD"].includes(dirOrFilename)) return [];

      if (!["md", "MD"].includes(type)) {
        // 开启扫描根目录时，则不添加提示功能，因为根目录有大量的文件/文件夹不是 md 文件，这里不应该打印
        if (!ignoreWarn && !onlyScannerRootMd) logger.warn(`该文件 '${filePath}' 非 .md 格式文件，不支持该文件类型`);
        return [];
      }

      const content = readFileSync(filePath, "utf-8");
      // 解析出 frontmatter 数据
      const { data: { title: frontmatterTitle, sidebar = true } = {}, content: mdContent } = matter(content, {});

      if (!sidebar) return [];
      // title 获取顺序：md 文件 formatter.title > md 文件一级标题 > md 文件名
      const mdTitle = titleFormMd ? getTitleFromMd(mdContent) : "";
      const text = frontmatterTitle || mdTitle || title;

      const sidebarItem = {
        text,
        collapsed: typeof collapsed === "function" ? collapsed(prefix + name, text) : collapsed,
        link: prefix + name,
      };

      if (isIllegalIndex(index)) sidebarItemsNoIndex.push(sidebarItem);
      else sidebarItems[index] = sidebarItem;
    }
  });

  // 将没有序号的 sidebarItemsNoIndex 放到最后面
  sidebarItems = [...sidebarItems, ...sidebarItemsNoIndex].filter(Boolean);

  return sideBarItemsResolved?.(sidebarItems) ?? sidebarItems;
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
   * 如果 filename 为 ke.md，则解析为 ['ke', 'md']，最后结果为 { index: 0, title: ke, type: md, name: ke }
   * 如果 filename 为 1.ke.md，则解析为 ['1', 'ke', 'md']，最后结果为 { index: 1, title: ke, type: md, name: 1.ke }
   * 如果 filename 为 1.ke.d.md，则解析为 ['1', 'ke.d', 'md']，最后结果为 { index: 1, title: ke.d, type: md, name: 1.ke.d }
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
    name = stat.isDirectory() ? filename : filename.substring(0, lastDotIndex);

    if (stat.isDirectory()) title = filename.substring(firstDotIndex + 1);
    else title = filename.substring(firstDotIndex + 1, lastDotIndex);
  }

  return { index, title, type, name };
};

/**
 * 按顺序从该目录下的 [index.md, index.MD, 目录名.md] 文件获取一级标题，一旦获取到第一个则不再继续遍历
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
