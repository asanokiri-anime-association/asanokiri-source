# 朝之雾动漫社网站

面向新生、现役成员和公开访客的门户，由映像研究部统一维护。网站展示社团构成、历史、角色、作品与代表活动；内部资料及部门沟通留在飞书。

采用“雾境书院”的日式幻想视觉：暖纸、墨绿、铜金线饰与学院风景。旧 demo 的公开社团素材用于内容占位，出处与待确认项见 [内容来源](docs/content-sources.md)。

## 本地运行

安装 Node.js 24 LTS，然后在此目录执行：

```sh
npm ci
npm run dev
```

开发地址由终端显示，默认 `http://localhost:5173`。推荐 VS Code 的 Vue - Official 扩展。交接时使用 `npm ci` 安装锁定的依赖。

```sh
npm run typecheck     # Vue 模板、前端和构建脚本的严格类型检查
npm test              # 主题、公告、内容、Markdown 与时间轴边界
npm run build         # 先类型检查，再构建 dist/
npm run preview       # 查看构建产物
npm run check:content # 单独检查内容
npm run format        # 统一排版
```

## 按页面找代码

页面按从上到下、从左到右的 DOM 阅读顺序书写。共享样式和页面样式集中在 `src/styles/`，Vue 文件保留类型、交互和页面结构；不通过 CSS `order` 或反向布局重排内容。

| 你要改什么                                 | 位置                                                             |
| ------------------------------------------ | ---------------------------------------------------------------- |
| 首页：公告、序章、部门、历程、文化、活动   | `src/pages/HomePage.vue`                                         |
| 简介、部门、历程、公开联系                 | `src/pages/AboutPage.vue`                                        |
| 物语、角色形象、历届作品                   | `src/pages/CulturePage.vue`                                      |
| 代表活动与公众号链接                       | `src/pages/ActivitiesPage.vue`                                   |
| 页头、导航、页脚                           | `src/components/SiteHeader.vue`、`SiteFooter.vue`                |
| 颜色、字体、尺度、主题过渡                 | `src/styles/theme.css`                                           |
| 公共排版、按钮、正文                       | `src/styles/base.css`                                            |
| 导航、主题控件、公告、活动列表、联系、页脚 | `src/styles/components.css`                                      |
| 固定时间轴交互与样式                       | `src/components/HistoryTimeline.vue`、`src/styles/chronicle.css` |
| 首页与内页栏目样式                         | `src/styles/pages.css`                                           |
| 三态主题与首屏初始化                       | `src/theme/`、`src/components/ThemeControl.vue`                  |
| 路由                                       | `src/router/index.ts`                                            |
| CMS 字段                                   | `public/admin/config.yml`                                        |
| 内容模型与校验                             | `src/content/schema.ts`                                          |
| YAML、Markdown、二维码构建                 | `scripts/content.ts`、`scripts/markdown.ts`                      |

`src/App.vue` 负责页头、路由内容、页脚。页面保留完整栏目结构，确实复用或有独立行为的部分才拆组件。不预建全局状态库、数据库或业务 API。

## 维护与交接

- [内容维护指南](docs/content-guide.md)：发布、排序、Markdown、隐藏内容和公告。
- [部署与交接](docs/deployment.md)：Cloudflare Pages、鉴权 Worker、域名与账户。
- [内容来源](docs/content-sources.md)：旧素材映射与待核对项。
- [架构说明](docs/design-notes.md)：类型、内容构建、主题与时间轴。
- [样式修改指南](docs/style-guide.md)：视觉变量、样式归属与响应式规则。
- [装饰素材说明](docs/visual-assets.md)：插画提示词、字体和图标许可。

前台为 Vue 3 + TypeScript + Vue Router，Vite 构建，使用普通 CSS。Sveltia CMS 将内容提交到本仓库，现有 Cloudflare Worker 负责 GitHub 登录，Cloudflare Pages 发布 `dist/`。Markdown 只用于内容字段的排版，不引入独立文章系统。GitHub Actions 负责检查。
