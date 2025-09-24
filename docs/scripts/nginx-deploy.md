# Nginx部署说明

## 使用方法

1. **构建适合nginx的版本**：

   ```bash
   pnpm run docs:nginx
   ```

   > **注意**: 如果遇到pnpm版本问题，请确保使用Node.js v18+版本：
   >
   > ```bash
   > nvm use v18.20.8  # 或更高版本
   > ```

2. **部署到nginx**：

   - 将 `docs/.vitepress/dist/` 目录下的所有文件复制到nginx根目录
   - 确保nginx配置了 `try_files $uri $uri/ /index.html;`

3. **nginx配置示例**：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/your/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## 特点

- ✅ 不影响现有的GitHub Pages和Cloudflare Pages部署
- ✅ 自动修复所有资源路径从 `/universal-iot-docs/` 改为 `/`
- ✅ 支持SPA路由
- ✅ 简单易用，一键构建
