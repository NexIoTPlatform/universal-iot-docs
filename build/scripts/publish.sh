# Teek 版本发布脚本
# 脚本运行格式：pnpm run publish <publish-tag> 或 pnpm run publish <publish-tag> <version>，<publish-tag> 为 NPM 的发布标签，<version> 为版本号
# 脚本运行格式例子：pnpm run publish alpha 1.1.0-alpha.1

#!/usr/bin/env bash
set -e

command=$1
version=$2

# npm publish 等于 npm publish --tag latest
if [ "$command" == "latest" ]; then
  publish_tag="latest"
elif [ "$command" == "beta" ]; then
  publish_tag="beta"
elif [ "$command" == "alpha" ]; then
  publish_tag="alpha"
elif [ "$command" == "canary" ]; then
  publish_tag="canary"
elif [ "$command" == "next" ]; then
  publish_tag="next"
else
  echo "Usage: $0 <publish-tag> or $0 <publish-tag> <version>"
  exit 1
fi

# 不允许生成 Git Commit 和 Git Tag，不允许将版本号设置为与当前版本相同
npm version "$version" --no-git-tag-version

npm run clean
npm run build

cd dist/vitepress-theme-teek
echo "publish vitepress-theme-teek..."
npm publish --tag $publish_tag
echo "Successfully published vitepress-theme-teek"
cd -

echo "✅ Publish completed"
exit
