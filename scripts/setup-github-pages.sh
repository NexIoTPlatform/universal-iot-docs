#!/bin/bash

# GitHub Pages 设置脚本
# 此脚本帮助用户快速设置 GitHub Pages 部署

echo "🚀 开始设置 GitHub Pages 部署..."

# 检查是否在 Git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 错误: 当前目录不是 Git 仓库"
    echo "请先初始化 Git 仓库: git init"
    exit 1
fi

# 检查是否有远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ 错误: 没有配置远程仓库"
    echo "请先添加远程仓库: git remote add origin <your-repo-url>"
    exit 1
fi

# 获取仓库信息
REPO_URL=$(git remote get-url origin)
REPO_NAME=$(basename -s .git "$REPO_URL")
USERNAME=$(echo "$REPO_URL" | sed -n 's/.*github\.com[:/]\([^/]*\)\/.*/\1/p')

echo "📋 仓库信息:"
echo "  仓库名: $REPO_NAME"
echo "  用户名: $USERNAME"

# 检查是否需要配置 base 路径
if [[ "$REPO_NAME" != "$USERNAME.github.io" ]]; then
    echo "⚠️  注意: 仓库名不是 $USERNAME.github.io"
    echo "   需要在 VitePress 配置中添加 base 路径"
    echo "   请在 docs/.vitepress/config.ts 中添加:"
    echo "   base: '/$REPO_NAME/'"
    echo ""
    echo "✅ 已自动配置 base 路径为: '/$REPO_NAME/'"
    echo "✅ 已自动配置 sitemap hostname 为: 'https://$USERNAME.github.io/$REPO_NAME'"
fi

echo ""
echo "📝 接下来的步骤:"
echo "1. 推送代码到 GitHub:"
echo "   git add ."
echo "   git commit -m 'feat: add GitHub Actions deployment'"
echo "   git push origin main"
echo ""
echo "2. 在 GitHub 仓库设置中启用 Pages:"
echo "   - 进入 Settings > Pages"
echo "   - Source 选择 'GitHub Actions'"
echo ""
echo "3. 配置仓库权限:"
echo "   - 进入 Settings > Actions > General"
echo "   - Workflow permissions 选择 'Read and write permissions'"
echo ""
echo "4. 检查部署状态:"
echo "   - 进入 Actions 标签页查看工作流运行状态"
echo "   - 部署成功后访问: https://$USERNAME.github.io/$REPO_NAME"
echo ""
echo "🎉 你的 Universal IoT 文档将部署到: https://$USERNAME.github.io/$REPO_NAME"
echo ""
echo "✅ 设置完成！" 