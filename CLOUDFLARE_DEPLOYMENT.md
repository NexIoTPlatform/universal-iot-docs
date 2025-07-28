# Cloudflare Pages 部署指南

本项目支持部署到 Cloudflare Pages，配置已针对 Cloudflare Pages 环境进行了优化。

## 环境变量配置

在 Cloudflare Pages 中设置以下环境变量：

### 构建环境变量

- `CF_PAGES`: 自动设置，无需手动配置
- `CF_PAGES_URL`: 你的 Cloudflare Pages 域名（可选）

### 构建配置

- **构建命令**: `pnpm run stub && pnpm run docs:build`
- **构建输出目录**: `docs/.vitepress/dist`
- **Node.js 版本**: 22

## 部署步骤

### 1. 连接 GitHub 仓库

1. 登录 Cloudflare Dashboard
2. 进入 Pages 页面
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择你的 GitHub 仓库: `PhoenixHai/universal-iot-docs`

### 2. 配置构建设置

- **项目名称**: `universal-iot-docs` (或你想要的名称)
- **生产分支**: `main`
- **框架预设**: `None`
- **构建命令**: `pnpm run stub && pnpm run docs:build`
- **构建输出目录**: `docs/.vitepress/dist`

### 3. 环境变量设置

在 "Environment variables" 部分添加：

- `NODE_VERSION`: `22`
- `PNPM_VERSION`: `10.7.1`

### 4. 部署

点击 "Save and Deploy" 开始部署

## 自动配置

项目已自动配置以下内容：

### Base 路径

- **GitHub Pages**: `/universal-iot-docs/`
- **Cloudflare Pages**: `/` (根路径)

### Sitemap

- **GitHub Pages**: `https://phoenixhai.github.io/universal-iot-docs`
- **Cloudflare Pages**: `https://universal-iot-docs.pages.dev`

### 重定向规则

- `_redirects` 文件确保 SPA 路由正常工作

## 故障排除

### 样式丢失问题

如果样式丢失，检查：

1. Base 路径配置是否正确
2. 构建输出目录是否正确
3. 静态资源路径是否正确

### 构建失败

如果构建失败，检查：

1. Node.js 版本是否为 22
2. pnpm 版本是否为 10.7.1
3. 构建命令是否正确

### 路由问题

如果路由不工作，检查：

1. `_redirects` 文件是否存在
2. 重定向规则是否正确

## 访问地址

部署成功后，你的文档将在以下地址可用：

- **Cloudflare Pages**: `https://universal-iot-docs.pages.dev`
- **GitHub Pages**: `https://phoenixhai.github.io/universal-iot-docs`

## 优势

Cloudflare Pages 的优势：

- ⚡ **更快的全球 CDN**
- 🔒 **自动 HTTPS**
- 🌍 **全球边缘网络**
- 💰 **免费额度充足**
- 🚀 **自动部署**
