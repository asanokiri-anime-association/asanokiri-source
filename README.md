# 朝之雾动漫社网站

面向新生、现役成员和公开访客的门户，由映像研究部统一维护。网站展示社团构成、发展历程、原创角色、历届作品与代表活动；内部资料及部门沟通留在飞书。

视觉采用“雾境书院”的日式幻想风格：暖纸、墨绿、铜金线饰与学院风景。前台为 Vue 3 + TypeScript + Vue Router，Vite 构建，普通 CSS；Sveltia CMS 把内容提交到本仓库，Cloudflare Pages 构建并发布。

## 本地运行

安装 `.nvmrc` 指定的 Node.js LTS（使用 fnm 时执行 `fnm use`），然后：

```sh
npm ci
npm run dev
```

开发地址默认为 `http://localhost:5173`。

| 命令                    | 作用                                           |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | 开发服务器，修改 `data/` 后自动刷新            |
| `npm test`              | 主题、公告、内容校验、Markdown 与时间轴的测试  |
| `npm run build`         | 严格类型检查后构建到 `dist/`                   |
| `npm run preview`       | 预览构建产物                                   |
| `npm run typecheck`     | 只做类型检查（Vue 模板、前端、构建脚本与测试） |
| `npm run check:content` | 只校验 `data/` 中的内容                        |
| `npm run check:format`  | 检查格式；`npm run format` 自动修正            |

提交前运行 `npm run check:format`、`npm test` 与 `npm run build`，GitHub Actions 会执行同样的检查。

## 目录

```text
index.html            页面入口；构建时在 <head> 内联首屏主题脚本
src/
  main.ts             创建应用，按层次导入样式
  App.vue             页头、路由内容、页脚
  router/index.ts     路由、主导航、换页后的标题与焦点
  pages/              首页、了解社团、文化与作品、代表活动、未找到页面
  components/         共享区域与独立交互（页头、公告、时间轴、主题切换等）
  styles/             theme → base → components → chronicle → pages
  content/schema.ts   内容模型（Zod），类型由此推导
  lib/                可单独测试的纯函数（公告时间、时间轴进度）
  theme/              首屏主题脚本与主题类型
scripts/              构建时代码：内容校验与生成、Markdown、主题脚本转译
data/                 CMS 编辑的 YAML 内容
public/
  admin/              Sveltia CMS 入口与字段配置
  uploads/            CMS 媒体库（内容图片、二维码）
  art/                装饰插画
  licenses/           随站点分发的字体与图标许可
tests/                Node 内置测试
docs/                 维护文档
```

## 按页面找代码

页面源码按页面从上到下的阅读顺序书写，样式文件中的规则也按同样顺序排列，响应式覆盖放在文件末尾。

| 要修改的内容                               | 位置                                                             |
| ------------------------------------------ | ---------------------------------------------------------------- |
| 页头、导航、主题切换                       | `src/components/SiteHeader.vue`、`ThemeControl.vue`              |
| 首页：公告、序章、部门、历程、文化、活动   | `src/pages/HomePage.vue`                                         |
| 社团简介、部门、历程、联系方式             | `src/pages/AboutPage.vue`                                        |
| 社团物语、角色形象、历届作品               | `src/pages/CulturePage.vue`                                      |
| 代表活动与公众号链接                       | `src/pages/ActivitiesPage.vue`                                   |
| 页脚                                       | `src/components/SiteFooter.vue`                                  |
| 颜色、字体、页宽、页眉高度                 | `src/styles/theme.css`                                           |
| 排版、按钮、链接、Markdown 正文            | `src/styles/base.css`                                            |
| 导航、主题控件、公告、活动列表、联系、页脚 | `src/styles/components.css`                                      |
| 发展历程时间轴                             | `src/components/HistoryTimeline.vue`、`src/styles/chronicle.css` |
| 首页与内页的栏目排版                       | `src/styles/pages.css`                                           |
| 内容字段                                   | `src/content/schema.ts`、`public/admin/config.yml`               |
| YAML、Markdown、二维码的构建               | `scripts/content.ts`、`scripts/markdown.ts`                      |

## 文档

- [内容维护](docs/content.md)：给使用 CMS 的干部——发布、排序、Markdown、公告、二维码、旧素材与待确认项。
- [部署与交接](docs/deployment.md)：Cloudflare Pages、CMS 登录 Worker、域名、换届交接与上线检查。
- [开发说明](docs/development.md)：给修改代码的人——架构、内容构建、主题、时间轴、样式与素材许可。
