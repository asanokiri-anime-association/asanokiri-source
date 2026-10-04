# 部署与交接

## Cloudflare Pages

Pages 项目连接组织仓库 `asanokiri-anime-association/asanokiri-source`，生产分支为 `main`。

| 设置     | 值                                                              |
| -------- | --------------------------------------------------------------- |
| 根目录   | 仓库根目录                                                      |
| 构建命令 | `npm run build`                                                 |
| 产物目录 | `dist`                                                          |
| Node     | 读取仓库的 `.nvmrc`；控制台若设置了 `NODE_VERSION` 则须与之一致 |

Pages 构建镜像不识别 `lts/*` 这类别名，所以 `.nvmrc` 写当前 LTS 的主版本号。Node 发布新的 LTS 后，同时更新 `.nvmrc`、`package.json` 的 `engines` 与 `@types/node` 的主版本。若项目仍保留旧原型的 `.vitepress/dist` 产物目录或 `SITE_BASE` 变量，改为上表设置并删除该变量。

站点部署在域名根路径。代码合并进 `main` 后发布；内容由 CMS 提交到 `main` 后发布。其他分支由 Pages 生成预览，正式上线前先检查预览。

项目不生成顶层 `404.html`，依靠 [Pages 的 SPA 回退](https://developers.cloudflare.com/pages/configuration/serving-pages/#single-page-application-spa-rendering) 支持直接访问和刷新 `/about`、`/culture`、`/activities`；未知地址由前台显示返回首页的提示。`/admin/` 是独立的静态页面。

GitHub Actions 的 `check.yml` 只检查格式、测试和构建，权限只读，不参与部署。旧原型用于推送部署仓库 `amekuro/asanokiri` 的 `DEPLOY_KEY` 已不再需要，由组织管理员决定归档或撤销。

## 域名与 CMS 登录

正式域名为 `www.hzyzzw.com`。先在 Pages 项目中添加该自定义域名，再按控制台提示在阿里 DNS 配置 CNAME，等待 Cloudflare 完成域名与证书验证；只改 CNAME 而不在 Pages 绑定域名并不完整。根域名 `hzyzzw.com` 如需访问，单独选择受支持的绑定或跳转方式，不假设阿里 DNS 支持根域 CNAME 扁平化。

CMS 配置中的网站地址为 `https://www.hzyzzw.com`，GitHub 登录使用现有的 `https://sveltia-cms-auth.asanokiri.workers.dev`。CMS 与登录 Worker 独立部署，前台不需要其他 Worker。登录用户需要仓库写权限。

切换域名前，核对 Worker 的允许来源、GitHub OAuth App 及回调地址是否覆盖正式域名；客户端密钥不得写进仓库。用组织内有写权限的测试账号完成一次“登录 → 编辑一条已确认的内容 → 发布 → Pages 构建成功 → 前台出现”的联调，本地构建不能代替这一步。

Sveltia CMS 从 unpkg 加载，`public/admin/index.html` 中的版本范围只接收补丁更新。升级到新的次版本前，先查看 Sveltia 的更新说明并在本地打开 `/admin/` 确认配置可以加载。

## 换届交接

代码留在 GitHub 组织，日常维护者加入映像研究部对应团队并获得仓库写权限。组织 Owner 至少保留两名适任负责人，普通编辑者不需要组织最高权限。若给 `main` 设置必须经 PR 合并的分支保护，CMS 的直接发布会被阻止，需要同时调整内容发布方式。

在飞书交接文档中记录：仓库与团队、Cloudflare 项目与账户负责人、Worker 与 OAuth App 负责人、阿里 DNS 与域名续费负责人、后台入口和账户恢复流程。账户归属与恢复方式应能由下一届接管，公开仓库中不记录口令或恢复码。

## 回退

网站可在 Pages 控制台回退到上一次成功的部署；内容修改可在 GitHub 撤销对应提交。回退后同时修正源数据，避免下一次构建再次发布错误内容。

## 上线前检查

- 现任干部完成[内容维护](content.md#旧素材与待确认项)中的待确认项，更新公开联系方式。
- 运行 `npm ci`、`npm test`、`npm run build`，在手机和桌面检查预览。
- 确认 Pages 构建设置，验证子页面刷新、主题记忆和 `/admin/`。
- 验证正式域名的 HTTPS 与 CMS 登录发布。
