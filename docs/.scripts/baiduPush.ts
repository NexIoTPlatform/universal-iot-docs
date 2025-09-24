import { appendFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { glob } from "tinyglobby";
const docsRoot = process.cwd();
const urlsPath = join(docsRoot, "urls.txt");

let domain = process.argv.splice(2)[0]; // 获取命令行传入的参数

const cleanUrls = true;
const main = async () => {
  // 先尝试删除文件
  if (existsSync(urlsPath)) unlinkSync(urlsPath);

  domain = domain.replace(/\/$/, "");
  writeFileSync(urlsPath, domain);

  const mdFiles = (
    await glob("**/*.md", {
      expandDirectories: false,
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "**/components/**",
        "**/.vitepress/**",
        "**/public/**",
        "**/.scripts/**",
      ],
    })
  ).sort();

  // 文件实际路径
  for (const file of mdFiles) {
    if (!file.endsWith(".md")) continue;
    const link = `${domain}/${file.replace("index.md", "").replace(".md", cleanUrls ? "" : ".html")}`;
    // 去掉首页 index.md
    if (`${domain}/` !== link) appendFileSync(urlsPath, `\r\n${link}`);
  }

  // 永久链接
  for (const file of mdFiles) {
    if (!file.endsWith(".md")) continue;

    const src = readFileSync(file, "utf-8");
    const { data: frontmatter } = matter(src);

    if (frontmatter.permalink) {
      const link = `${domain}${frontmatter.permalink}${cleanUrls ? "" : ".html"}`;
      appendFileSync(urlsPath, `\r\n${link}`);
    }
  }
};

if (domain) main();
else console.warn("请指定一个百度推送的域名参数");
