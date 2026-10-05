# 开发说明

## 架构与边界

这是低频更新的公开门户，内容由干部在 CMS 管理。没有访客登录、评论、站内报名、数据库或业务 API，也没有跨页面同步的业务状态，因此不引入状态库。新功能按真实需要增加页面、内容字段和组件，不预建空接口或通用配置引擎。

页面数据来自构建产物：Vite 插件（`vite.config.ts`）在构建时读取 `data/` 并生成虚拟模块 `virtual:club-content`。YAML 解析、Zod、Markdown 解析和二维码生成都只在构建时运行，不进入浏览器。

`src/pages` 保留各栏目的完整结构，只有共享区域或独立交互才拆为组件。页面 DOM 顺序与视觉阅读顺序一致，不用 CSS `order`、反向 flex 或 dense grid 重排。

模板里文字与行内元素之间的换行会渲染成空格，中文标题中会显出多余的间隔，所以写作 `让想象，<em>拥有名字。</em>`、`展开公告<ChevronDown aria-hidden="true" />`。Prettier 按 CSS 的显示方式处理空白，不会增删这类空白。一行放不下时，在标签内换行；按钮和链接都是 flex 容器，首尾空白不影响显示：

```vue
<RouterLink class="button-link button-link--outline" to="/culture">
    打开故事之书<BookOpen aria-hidden="true" />
</RouterLink>
```

## 依赖与类型

依赖使用 `^` 范围，`package-lock.json` 记录实际版本，`npm ci` 可复现安装。TypeScript 保持 6.x：7.0 不再提供 vue-tsc 依赖的编译器 API，待 vue-tsc 支持后再升级。

浏览器与 Node 分别使用 `tsconfig.app.json`（基于 `@vue/tsconfig`）和 `tsconfig.node.json`。两者都启用 `strict`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes` 与未使用变量检查，Vue 模板启用 `strictTemplates`。构建先运行 vue-tsc 与 tsc，不只依赖 Vite 的转译。

## 内容与 Markdown

`src/content/schema.ts` 是内容模型的唯一来源，类型由 Zod 推导；`public/admin/config.yml` 的字段须与之同步，测试会检查 CMS 字段能否覆盖现有内容。构建时校验必填字段、日期格式、HTTPS 链接与 `/uploads/` 图片是否存在。YAML 以 JSON schema 读取，日期和时间保持原文与时区。

隐藏条目在生成前台数据前过滤；部门、历程、角色与作品保持编辑顺序，活动按日期倒序。首页推荐数量写在 `HomePage.vue` 中。

Markdown 只由 `scripts/markdown.ts` 在构建时解析：关闭 HTML、自动链接与排版替换，禁用图片；链接只接受 HTTPS、站内绝对路径和锚点，外链在新窗口打开并附 `noopener noreferrer`；标题下移两级，从三级开始。结果带 `MarkdownHtml` 类型标记，只有 `MarkdownContent.vue` 使用 `v-html`。类型标记约束调用方式，真正的安全边界是解析配置与输入校验。

## 主题与首屏

`src/theme/bootstrap.ts` 在构建时由 Vite 去除类型，以普通脚本内联到 `<head>`，在样式和应用之前同步设置 `data-theme`、`color-scheme` 与浏览器主题色，并提供 `window.clubTheme` 作为唯一的主题状态。脚本不能导入运行时模块。

偏好为 `light`、`dark` 或 `auto`。显式选择不受系统设置变化影响；存储不可用时仍可切换；标签页之间同步偏好。支持 View Transitions 时用约 0.38 秒的交叉渐变，否则退回颜色过渡；减少动态效果时直接切换。

首屏背景色同时写在 `theme.css`、`bootstrap.ts` 与 `index.html` 的 `theme-color` 中，修改时一起更新并调整主题测试。

## 路由

`router/index.ts` 定义路由与主导航。换页后更新标题并把焦点移到 `<main>`；首次加载与同页锚点跳转不移动焦点。锚点滚动留出页眉高度。应用在初次导航完成前挂载，使直接打开带锚点的地址时，滚动发生在页面布局稳定之后。

## 发展历程时间轴

`HistoryTimeline.vue` 用有序的年份导航和独立的 `article` 表达完整历程，进度计算在 `src/lib/chronicle.ts`。

条目多于一项且没有减少动态效果偏好时启用固定舞台：外层轨道提供滚动距离，舞台用 `position: sticky` 固定在页眉下方。被动滚动监听经 `requestAnimationFrame` 计算进度，页面滚动位置是唯一的输入，不拦截滚轮。

进度换算为连接线末端的位置，节点高亮、当前正文和连接线都由它派生。每段连接线占相同的滚动距离并线性前进；连接线到达节点时点亮该节点并切换正文，经过的节点保持点亮；末个年份之后再前进半段，因此末章的阅读距离是其他章的一半。点击年份滚动到连接线恰好到达该节点的位置，并多留一个设备像素，避免浏览器对齐滚动位置后落回上一章。

宽度不足 980px 或高度不足 720px 时使用横向年份导航，手机上文字与配图上下排列；年份较多时导航在内部滚动，只在当前年份不可见时滚动导航自身。非当前章节设置 `inert` 与 `aria-hidden`。减少动态效果或不足两条历程时，所有章节按 DOM 顺序展开。

## 公告

公告在开始时刻（含）到结束时刻（不含）之间显示，按下一个时间边界设置定时器，回到标签页时重新校准，到期不需要重新构建。收起状态保存在访客设备，编号、时间、地点、标题或正文变化时重新提示。不使用模态遮罩。

## 样式

视觉方向是“雾境书院”：一本属于社团的幻想旅行手记。浅色是暖纸与铜金，深色是墨绿与月白，配以宋体标题、细线边框、魔法纹章和学院风景。幻想元素只用于氛围，社团事实与历史照片保持明确来源。

| 文件             | 内容                                           |
| ---------------- | ---------------------------------------------- |
| `theme.css`      | 颜色、字体、页宽、页眉高度与主题过渡           |
| `base.css`       | 基础元素、文字层级、按钮、链接、Markdown 正文  |
| `components.css` | 页头、主题控件、公告、活动列表、联系方式、页脚 |
| `chronicle.css`  | 时间轴的舞台、章节、年份导航与响应式布局       |
| `pages.css`      | 首页与各内页的栏目排版                         |

`theme.css` 由 `index.html` 直接引入以保证首屏颜色，其余样式按上表顺序在 `main.ts` 中导入。每个文件按页面阅读顺序排列，响应式覆盖放在末尾。选择器使用有归属的语义类名，只有全局基础元素使用标签选择器。Vue 文件不写静态样式，章节数量、进度等状态通过 CSS 变量传递。

常用变量：`--page` 页面底色，`--ink` 主要文字，`--muted` 次级文字，`--gold` 线饰与标签，`--line` 分隔线，`--night` 深色展示区。调整颜色时同时检查文字、图片说明、按钮和二维码在两种主题下的效果。

图标从 `@lucide/vue` 按需导入，通常 18px、1.5 线宽，加 `aria-hidden`，对应的链接或按钮保留文字名称；不用字符或 emoji 代替图标。`MagicSeal.vue` 是装饰性手绘 SVG，不进入读屏顺序；新增纹章保持相近的线宽与留白，避免在正文下叠加高对比纹理。

不要用持续闪烁、强制滚动或自动旋转来增加“魔法感”。

## 修改后检查

运行 `npm run check:format`、`npm test`、`npm run build`，再在浏览器中检查：

- 浅色、深色与跟随系统，刷新时没有错误的底色。
- 桌面 1365×900、窄屏 978×900，以及手机 390×844、320×568 和横屏 844×390；页面没有横向溢出。
- 时间轴的进入、换章、离开和年份按钮，低高度视口能完整阅读，减少动态效果时完整展开。
- 长部门名称、长说明、空栏目与历史照片；键盘焦点与图片说明。
- 直接打开 `/about#contacts` 等带锚点的地址时，目标位于页眉下方。

## 素材与许可

- Noto Serif SC Variable（中文标题）：`@fontsource-variable/noto-serif-sc`，SIL Open Font License 1.1，按 Unicode 范围分片加载。
- Cormorant Garamond（西文与年份）：`@fontsource/cormorant-garamond`，SIL Open Font License 1.1。
- Lucide 图标：`@lucide/vue`，ISC 许可。
- 许可副本位于 `public/licenses/`，随站点分发。字体自托管，不依赖外部字体服务；正文使用系统无衬线字体。

首页学院风景 `public/art/mist-academy.png`（1902×827）是生成的装饰插画，不是社团历史资料，也不进入 CMS。网页用 CSS 叠加主题色，深浅主题共用一张图。重新生成时可参考原提示词：

```text
Use case: illustration-story
Asset type: a wide panoramic background illustration for an anime association website, designed as the opening spread of an exquisite Japanese fantasy travel journal.
Primary request: a mist-covered magical academy and its quiet surrounding medieval / early-modern town, with slate roofs, a distant spired observatory, stone footbridge, pine woods and a river valley. Tiny warm lights in the observatory suggest scholarly magic. No people in the foreground.
Style/medium: refined Japanese animation background painting, delicate hand-drawn architectural lines, layered watercolor / gouache, subtle textured paper, atmospheric perspective, expressive but restrained. High artistic detail and carefully controlled color, not 3D game rendering, not glossy AI fantasy poster.
Composition/framing: very wide landscape about 2.3:1. This will sit behind actual HTML text on the left: keep the left third airy and very pale mist with minimal detail, gradually building architectural detail on the right half. Show a low bridge leading the eye toward the magical academy on a hillside at the upper right. Irregular pale parchment edges blend into an off-white web page. The middle and bottom remain soft with room for a thin ornamental line.
Lighting/mood: quiet dawn after rain, pale gold through blue-green mist, invitation to an adventure, mysterious but welcoming.
Color palette: warm ivory paper, muted jade and blue-green, deep pine, weathered bronze and tiny amber windows.
Constraints: image only, no typography, no letters, no logos, no watermark, no interface mockup, no card containers, no UI icons, no characters from existing franchises. Avoid saturated purple, neon effects, heavy lens flare, big glowing circles, highly contrasted foreground clutter. This is an original decorative setting, not a historical photograph.
```

社团插画、照片与二维码属于社团内容，来源见[内容维护](content.md#旧素材与待确认项)。
