# Permalink 404 问题修复指南

## 问题描述

当访问带有 `permalink` 的页面时（如 `/versions/plugins.html`），首次访问会正常跳转，但刷新页面后会出现 404 错误。

## 问题原因

1. **permalink 插件的工作原理**：
   - permalink 插件在**客户端（浏览器）**运行，通过 JavaScript 进行 URL 重写
   - 构建时**不会**生成实际的物理文件（如 `/versions/plugins.html`）
   - 只生成原始路径的文件（如 `/08.版本对比/plugins.html`）

2. **为什么刷新会 404**：
   - 当用户直接访问 `/versions/plugins.html` 并刷新时
   - nginx 尝试查找 `/versions/plugins.html` 文件
   - 文件不存在，nginx 返回 404
   - 浏览器无法加载页面，permalink 插件无法执行重定向逻辑

## 解决方案

在 nginx 配置中添加 `try_files` 指令，将所有请求回退到 `index.html`，让前端路由处理。

### 修改步骤

1. **找到你的 nginx 配置文件**（通常在 `/www/server/panel/vhost/nginx/docs.teambee.cc.conf`）

2. **在 `location /` 块中添加 `try_files` 指令**：

   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

3. **完整的 location / 配置示例**：

   ```nginx
   # 核心：添加 try_files 配置，支持 SPA 路由和 permalink
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

   > **说明**：
   > - `$uri`：尝试直接访问请求的文件
   > - `$uri/`：尝试访问请求的目录
   > - `/index.html`：如果以上都不存在，回退到 index.html，让前端路由处理

4. **重启 nginx**：
   ```bash
   nginx -t  # 测试配置是否正确
   nginx -s reload  # 或 systemctl reload nginx
   ```

### 注意事项

- `try_files` 必须放在 `location /` 块中
- 确保 `try_files` 在其他 location 规则之前或之后，但不要被其他 location 规则覆盖
- 如果使用了宝塔面板，可以在"网站设置" -> "伪静态"中添加，或在配置文件中直接修改

### 验证修复

修复后，访问以下 URL 应该都能正常工作：

1. 原始路径：`https://docs.nexiot.cc/08.%E7%89%88%E6%9C%AC%E5%AF%B9%E6%AF%94/plugins.html`
2. Permalink 路径：`https://docs.nexiot.cc/versions/plugins.html`
3. 刷新 permalink 路径应该不再出现 404

## 参考配置

完整的 nginx 配置示例请参考：`nginx-config-example.conf`

