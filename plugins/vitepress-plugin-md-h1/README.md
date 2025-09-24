# vitepress-plugin-md-h1

这是一个适用于 `vitepress` 的 Vite 插件，在 `vitepress` 启动后自动生成一级标题到 Markdown 文档开头处（假如 Markdown 文档没有设置过一级标题）。

> 说明：只在页面加载 Markdown 内容时生成一级标题，并不会真正修改 Markdown 文档内容。

插件默认只给 `frontmatter.layout` 不存在或者 `frontmatter.layout` 为 `doc` 的 Markdown 注入一级标题，如果希望强制注入一级标题，可以使用 `autoTitle` 配置。

## ✨ Feature

- 🚀 将 `frontmatter.title` 或「文件名」作为一级标题注入到 Markdown 文档开头处

## 🕯️ Install

安装 `vitepress-plugin-md-h1` 插件

```bash
# 推荐使用 pnpm
pnpm i vitepress-plugin-md-h1
# or yarn
yarn add vitepress-plugin-md-h1
# or npm
npm install vitepress-plugin-md-h1
```

添加 `vitepress-plugin-md-h1` 插件到 `.vitepress/config.ts`

```typescript
import { defineConfig } from "vitepress";
import MdH1 from "vitepress-plugin-md-h1";

export default defineConfig({
  vite: {
    plugins: [MdH1()],
  },
});
```

> 说明：该插件仅限项目启动时生效，已改动或新添加的 Markdown 需要重启项目才能生效。

## 🛠️ Options

<!-- prettier-ignore -->
| name         | description                                                  | type                                                         | default |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------- |
| ignoreList   | 忽略的文件路径，支持正则表达式                               | `string[]`                                                   | `[]`    |
| beforeInject | 添加一级标题前的钩子，如果返回 false，则不添加一级标题，如果返回 string，则使用返回值作为一级标题，string 必须是一个非空字符串 | `(frontmatter: Record<string, any>, id: string, title: string) => boolean | string | void` |         |

## 📘 TypeScript

### 🛠️ Options

```typescript
export interface MdH1Option {
  /**
   * 忽略的文件路径，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 添加一级标题前的钩子，如果返回 false，则不添加一级标题，如果返回 string，则使用返回值作为一级标题，string 必须是一个非空字符串
   */
  beforeInject?: (frontmatter: Record<string, any>, id: string, title: string) => boolean | string | void;
}
```

## 📖 Usage

如果不希望某个 Markdown 文档注入一级标题，请在该文档 `frontmatter` 配置：

```yaml
---
autoTitle: false
---
```

如果不希望某个目录下的所有 Markdown 文档注入一级标题，则使用 `ignoreList` 配置项：

```typescript
import { defineConfig } from "vitepress";
import MdH1 from "vitepress-plugin-md-h1";

export default defineConfig({
  vite: {
    plugins: [
      MdH1({
        ignoreList: ["xxx"],
      }),
    ],
  },
});
```

如果想根据文档的 `frontmatter` 或者文档路径来决定是否允许注入一级标题，则使用 `beforeInject` 钩子：

```typescript
import { defineConfig } from "vitepress";
import MdH1 from "vitepress-plugin-md-h1";

export default defineConfig({
  vite: {
    plugins: [
      MdH1({
        beforeInject: (frontmatter, id, title) => {
          // 根据 frontmatter 的某个值判断
          if (frontmatter.catalogue) return false;

          // 根据文档路径判断
          if (id.includes("@page")) return false;

          // 根据即将生成的一级标题判断
          if (title === "简介") return false;
        },
      }),
    ],
  },
});
```

`beforeInject` 钩子除了支持返回 `false` 来决定是否注入一级标题，也可以返回一个字符串替换为一级标题。

```typescript
import { defineConfig } from "vitepress";
import MdH1 from "vitepress-plugin-md-h1";

export default defineConfig({
  vite: {
    plugins: [
      MdH1({
        beforeInject: (frontmatter, id, title) => {
          // 根据 frontmatter 的某个值判断
          if (frontmatter.archivesPage) return "归档页";

          // 根据即将生成的一级标题判断
          if (title === "简介") return "文档简介";
        },
      }),
    ],
  },
});
```

## 🉑 License

[MIT](../../LICENSE) License © 2025 [Teeker](https://github.com/Kele-Bingtang)
