# GitHub Pages 部署指南

本项目使用 GitHub Actions 自动构建和部署 VitePress 到 GitHub Pages。

## 设置步骤

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库: https://github.com/PhoenixHai/universal-iot-docs
2. 点击 `Settings` 标签页
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分，选择 `GitHub Actions`

### 2. 配置仓库权限

确保你的仓库有以下权限设置：

1. 进入 `Settings` > `Actions` > `General`
2. 在 `Workflow permissions` 部分，选择 `Read and write permissions`
3. 勾选 `Allow GitHub Actions to create and approve pull requests`

### 3. 推送代码

将代码推送到 `main` 或 `master` 分支：

```bash
git add .
git commit -m "feat: add GitHub Actions deployment"
git push origin main
```

### 4. 检查部署状态

1. 进入 `Actions` 标签页查看工作流运行状态
2. 部署成功后，你的站点将在 `https://phoenixhai.github.io/universal-iot-docs` 可用

## 工作流说明

`.github/workflows/deploy.yml` 文件包含以下步骤：

1. **Checkout**: 检出代码
2. **Setup Node.js**: 设置 Node.js 18 环境
3. **Setup pnpm**: 设置 pnpm 包管理器
4. **Install dependencies**: 安装项目依赖
5. **Build VitePress**: 构建 VitePress 文档
6. **Upload artifact**: 上传构建产物到 GitHub Pages
7. **Deploy**: 部署到 GitHub Pages

## 自定义配置

### 修改构建输出目录

如果需要在 VitePress 配置中自定义输出目录，请在 `docs/.vitepress/config.ts` 中添加：

```typescript
export default defineConfig({
  // ... 其他配置
  outDir: "../dist", // 自定义输出目录
});
```

然后更新 `.github/workflows/deploy.yml` 中的 `path` 参数。

### 配置 Base 路径

如果你的仓库名不是 `username.github.io`，需要在 VitePress 配置中添加 base 路径：

```typescript
export default defineConfig({
  // ... 其他配置
  base: "/universal-iot-docs/", // 替换为你的仓库名
});
```

同时更新 sitemap 的 hostname：

```typescript
sitemap: {
  hostname: 'https://phoenixhai.github.io/universal-iot-docs',
  // ... 其他配置
}
```

### 修改触发分支

默认情况下，工作流在推送到 `main` 或 `master` 分支时触发。如需修改，请编辑 `.github/workflows/deploy.yml` 中的 `on.push.branches` 部分。

## 故障排除

### 常见问题

1. **构建失败**: 检查 Node.js 版本和依赖安装
2. **权限错误**: 确保仓库设置了正确的权限
3. **路径错误**: 确认构建输出路径正确

### 查看日志

在 `Actions` 标签页中点击具体的工作流运行，可以查看详细的构建日志来诊断问题。

## 相关链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [VitePress 部署指南](https://vitepress.dev/guide/deploying)
