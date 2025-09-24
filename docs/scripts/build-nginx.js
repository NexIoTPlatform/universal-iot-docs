#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const docsDir = join(__dirname, "..");

console.log("🚀 开始nginx构建流程...");
console.log("📁 构建目录:", docsDir);

function processFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    const newContent = content.replace(/\/universal-iot-docs\//g, "/");

    if (content !== newContent) {
      writeFileSync(filePath, newContent);
      console.log(`✅ 修复文件: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ 处理文件失败: ${filePath}`, error.message);
  }
}

function processDirectory(dirPath) {
  try {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.endsWith(".html") || item.endsWith(".css") || item.endsWith(".js")) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ 处理目录失败: ${dirPath}`, error.message);
  }
}

try {
  // 第一步：执行构建
  console.log("📦 步骤1: 执行VitePress构建...");
  execSync("npm run build", {
    cwd: docsDir,
    stdio: "inherit",
  });

  // 第二步：修复路径
  console.log("🔧 步骤2: 修复路径用于nginx部署...");
  const distDir = join(docsDir, ".vitepress", "dist");
  console.log("📁 目标目录:", distDir);

  processDirectory(distDir);

  console.log("✅ nginx构建完成！");
  console.log("🌐 现在可以部署到nginx根路径了");
  console.log("");
  console.log("💡 部署说明:");
  console.log("1. 将 .vitepress/dist/ 目录下的所有文件复制到nginx根目录");
  console.log("2. 确保nginx配置了 try_files $uri $uri/ /index.html;");
  console.log("3. 重启nginx服务");
} catch (error) {
  console.error("❌ 构建失败:", error.message);
  process.exit(1);
}
