import tasks from "./tasks";
import { copyFile, readFile, writeFile } from "fs/promises";
import { copy } from "fs-extra";
import { resolve } from "path";
import { tkPackage, tkOutput, projectRoot, buildOutput, tkRoot } from "./helper";
import picocolors from "picocolors";

/**
 * 复制 .d.ts 文件到指定目录
 */
const copyTypesDefinitions = async () => {
  const typesDirSrc = resolve(buildOutput, "types");

  // 复制 .d.ts 到 es
  await copy(typesDirSrc, resolve(tkOutput, "es"));

  // 复制 .d.ts 到 lib
  await copy(typesDirSrc, resolve(tkOutput, "lib"));
};

/**
 * 复制指定的项目文件到打包目录下
 */
const copyFiles = () =>
  Promise.all([
    copyFile(tkPackage, resolve(tkOutput, "package.json")),
    copyFile(resolve(projectRoot, "README.md"), resolve(tkOutput, "README.md")),
  ]);

/**
 * 在 package.json 更新版本号
 */
const updateVersionInPackage = async () => {
  const tkOutputPkg = resolve(tkOutput, "package.json");
  const tkOutputPkgContent = await readFile(tkOutputPkg, "utf-8");
  const tkPackageContent = await readFile(resolve(projectRoot, "package.json"), "utf-8");
  const tkOutputPkgInfo = JSON.parse(tkOutputPkgContent);
  const tkPackageInfo = JSON.parse(tkPackageContent);
  tkOutputPkgInfo.version = tkPackageInfo.version;

  await writeFile(tkOutputPkg, JSON.stringify(tkOutputPkgInfo, null, 2) + "\n");
};

/**
 * 在 version.ts 文件更新版本号
 */
const updateVersionInTs = async () => {
  const tkPackageContent = await readFile(resolve(projectRoot, "package.json"), "utf-8");
  const tkPackageInfo = JSON.parse(tkPackageContent);

  const versionFile = resolve(tkRoot, "version.ts");
  const versionContent = await readFile(versionFile, "utf-8");
  const newVersion = versionContent.replace(/"([^"]+)"/, `"${tkPackageInfo.version}"`);

  await writeFile(versionFile, newVersion);
};

updateVersionInTs().then(() => {
  console.log(picocolors.green("Successfully updated version"));

  Promise.all(tasks).then(async () => {
    await copyTypesDefinitions();
    console.log(picocolors.green("Successfully copied definition file"));

    await copyFiles();
    console.log(picocolors.green("Successfully copied package.json and README.md"));

    await updateVersionInPackage();
    console.log(picocolors.green("Successfully updated package version"));
  });
});
