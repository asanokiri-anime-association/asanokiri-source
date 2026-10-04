# 项目约定

本仓库是朝之雾动漫社公开门户。使用说明见 README.md，架构见 docs/design-notes.md，视觉维护见 docs/style-guide.md，交接见 docs/deployment.md。

## 已确认要求

- 面向新生、现役成员与公开访客。内部资料留在飞书和社团归档硬盘。
- 四个栏目：首页、了解社团、文化与作品、代表活动。活动详情链接公众号，不自建文章系统。
- 由映像研究部管理，涉及部门的修改在飞书沟通。CMS 负责编辑与发布。
- 不沿用旧 GitHub 原型的视觉设计、模板和样式。旧 demo 提供注明来源的公开资料和占位图片。
- 日式异世界、魔法、中世纪至近代偏好，当前采用“雾境书院”设计。支持浅色、深色、跟随系统，切换有动画，尊重减少动态效果，首屏不闪白。
- 发展历程在桌面、平板和手机上均固定于页眉下方，随滚动换章；窄屏使用横向年份导航，减少动态效果时完整顺序展示。
- 纳新使用可收起的内嵌公告，不使用模态弹窗。
- Cloudflare Pages 托管，现有 Worker 负责 CMS 登录，历史域名使用阿里 DNS。

## 开发约定

1. 业务、构建脚本与测试使用 TypeScript，Vue 使用 script setup lang="ts"。
2. 严格类型和 Vue 模板检查必须通过，不用 any、ts-ignore 或双重断言掩盖错误。
3. 原始内容模型以 src/content/schema.ts 为唯一来源，类型由 Zod 推导。CMS 与模型同步更新；构建产物扩展经过处理的 HTML 与二维码字段。
4. 页面 DOM 顺序与视觉阅读顺序一致，不通过 CSS order、反向 flex 或 dense grid 重排语义顺序。
5. src/pages 保留栏目骨架，src/components 放共享区域或独立交互。不为抽象而拆小段 HTML。
6. 使用普通 CSS 和语义类名。样式集中在 src/styles：theme.css 放变量，base.css 放排版，components.css 放复用组件，chronicle.css 放时间轴，pages.css 放页面栏目。Vue 中仅保留由状态驱动的动态样式变量。
7. 图标使用 @lucide/vue 按需导入，装饰纹章使用 MagicSeal.vue 的手绘 SVG；不用字符代替图标。
8. 依赖版本固定并提交锁文件，升级前检查兼容性。
9. Markdown 仅由 scripts/markdown.ts 在构建时解析，关闭原始 HTML，限制链接。只有 MarkdownContent.vue 接收带类型标记的构建结果并使用 v-html，不接受任意字符串或访客输入。
10. 公开图片使用 public/uploads，装饰插画使用 public/art；旧资料保留待确认说明，不补造作者、日期或活动事实。
11. 注释描述职责、约束和行为，不记录“本次修改”的过程。历史变更由 Git 记录。
12. 构建输出 dist/，GitHub Actions 只检查。架构改动同步维护文档，完成后运行 npm test、npm run build 与格式检查。

## 当前边界

无访客登录、评论、站内报名、数据库、独立业务 API 或 CMS 审批流程。作品视频使用公开外链。新功能按真实需要增加，保留路由和组件扩展点。
