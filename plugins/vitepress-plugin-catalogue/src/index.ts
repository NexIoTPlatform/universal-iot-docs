import type { Plugin } from "vite";
import { Catalogue, CatalogueOption } from "./types";
import createCatalogues from "./helper";
import { join } from "node:path";
import logger from "./log";

export * from "./types";

export default function VitePluginVitePressCatalogue(option: CatalogueOption = {}): Plugin & { name: string } {
  let isExecute = false;

  return {
    name: "vite-plugin-vitepress-catalogue",
    config(config: any) {
      // 防止 vitepress build 时重复执行
      if (isExecute) return;
      isExecute = true;

      const {
        site: { themeConfig },
        srcDir,
      } = config.vitepress;

      const baseDir = option.path ? join(srcDir, option.path) : srcDir;
      const catalogues = createCatalogues({ ...option, path: baseDir });

      const finalCatalogues: Catalogue = { arr: catalogues, map: {}, inv: {} };

      catalogues.forEach(item => {
        const { filePath, path, catalogues = [] } = item;

        finalCatalogues.map[filePath] = { path, catalogues };
        finalCatalogues.inv[path] = { filePath, catalogues };
      });

      themeConfig.catalogues = finalCatalogues;

      logger.info("Injected Catalogues Data Successfully. 注入目录页数据成功!");
    },
  };
}
