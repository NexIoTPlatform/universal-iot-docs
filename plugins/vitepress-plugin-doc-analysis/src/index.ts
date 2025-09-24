import type { Plugin } from "vite";
import { DocAnalysis, DocAnalysisOption, FilePathInfo } from "./types";
import { join } from "node:path";
import readFileList from "./helper";
import { getGitLastCommitTime, getEachFileWords, getTotalFileWords, getLastUpdateTime } from "./util";
import logger from "./log";

export * from "./types";

export default function VitePluginVitePressDocAnalysis(option: DocAnalysisOption = {}): Plugin & { name: string } {
  let isExecute = false;

  return {
    name: "vitepress-plugin-doc-analysis",
    config(config: any) {
      // 防止 vitepress build 时重复执行
      if (isExecute) return;
      isExecute = true;

      const {
        site: { themeConfig = {}, locales = {} },
        srcDir,
      } = config.vitepress;

      const baseDir = option.path ? join(srcDir, option.path) : srcDir;
      const newOption = { ...option, path: baseDir };

      // 国际化多语言 key 数组
      const localesKeys = Object.keys(locales).filter(key => key !== "root");

      // 如果不是多语言，则不需要处理多语言的文档分析
      if (!localesKeys.length) return doDocAnalysisThenSet(themeConfig, readFileList(newOption), newOption);

      // 国际化处理，针对每个语言的目录进行单独的扫描（除了 root）
      localesKeys.forEach(localesKey => {
        const fileList = readFileList({ ...newOption, path: `${baseDir}/${localesKey}` }, localesKey);
        doDocAnalysisThenSet(locales[localesKey].themeConfig, fileList, newOption);
      });

      // 对 root 根目录的文档进行单独的分析，且不扫描其他语言目录
      const rootFileList = readFileList({
        ...newOption,
        ignoreList: [...(newOption.ignoreList || []), ...localesKeys],
      });
      doDocAnalysisThenSet(locales["root"].themeConfig, rootFileList, newOption);
    },
  };
}

const doDocAnalysisThenSet = async (themeConfig: any, fileList: FilePathInfo[], option: DocAnalysisOption) => {
  const filePathList = fileList.map(item => item.filePath);

  // 支持自定义函数来返回额外的文件信息
  const { transformFile } = option;
  const newFileList = fileList.map(file => {
    if (transformFile) file = { ...transformFile(file), ...file };
    return file;
  });

  const totalFileWords = getTotalFileWords(filePathList);
  const eachFileWords = getEachFileWords(newFileList, option.cn, option.en);
  const lastCommitTime = (await getGitLastCommitTime()) || getLastUpdateTime(filePathList);

  // 防止 themeConfig 为 undefined
  themeConfig = themeConfig || {};
  themeConfig.docAnalysisInfo = {
    fileList: newFileList,
    totalFileWords,
    eachFileWords,
    lastCommitTime,
  } as DocAnalysis;

  logger.info("Injected DocAnalysisInfo Data Successfully. 注入文档分析数据成功!");
};
