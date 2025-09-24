import { resolve } from "path";
import { pkgName, outputPkgName } from "./constants";

/** 项目根目录 `/`  */
export const projectRoot = resolve(__dirname, "..", "..");
/** `/packages` */
export const pkgRoot = resolve(projectRoot, "packages");
/** `/packages/teek` */
export const tkRoot = resolve(pkgRoot, pkgName);

/** `docs` */
export const docsDirName = "docs";
export const docRoot = resolve(projectRoot, docsDirName);
export const vpRoot = resolve(docRoot, ".vitepress");

/** `/dist` */
export const buildOutput = resolve(projectRoot, "dist");
/** `/dist/vitepress-theme-teek` */
export const tkOutput = resolve(buildOutput, outputPkgName);
/** `/dist/types` */
export const tsOutput = resolve(buildOutput, "types");

/** `/packages/teek/package.json` */
export const tkPackage = resolve(tkRoot, "package-release.json");
/** `/package.json` */
export const projectPackage = resolve(projectRoot, "package.json");
/** `/docs/package.json` */
export const docPackage = resolve(docRoot, "package.json");

/** `/tsconfig.web.json` */
export const webTsConfig = resolve(projectRoot, "tsconfig.web.json");

/** `/dist/vitepress-theme-teek/theme-chalk` */
export const tcOutput = resolve(tkOutput, "theme-chalk");
