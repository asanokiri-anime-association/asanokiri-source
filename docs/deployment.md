# 部署与交接

## Cloudflare Pages

继续连接组织仓库 `asanokiri-anime-association/asanokiri-source`，生产分支 `main`。本次重构需要把现有项目的构建设置改为：

| 设置     | 值                                                              |
| -------- | --------------------------------------------------------------- |
| 根目录   | 仓库根目录                                                      |
| 构建命令 | `npm run build`                                                 |
| 产物目录 | `dist`                                                          |
| Node     | `24`，仓库已有 `.nvmrc`；如控制台有 `NODE_VERSION`，同步为 `24` |

旧的 `.vitepress/dist` 产物路径和 `SITE_BASE` 设置不再使用。应用部署在域名根路径。代码通过合并进入 `main` 发布；内容通过 CMS 提交到 `main` 发布。分支可由 Pages 生成预览，正式上线前先检查预览。

本项目不生成顶层 `404.html`，使用 [Cloudflare Pages 的 SPA 回退](https://developers.cloudflare.com/pages/configuration/serving-pages/#single-page-application-spa-rendering) 支持直接访问和刷新 `/about`、`/culture`、`/activities`。未知页面由 Vue 显示返回首页提示。`/admin/index.html` 为独立静态文件。

GitHub Actions 的 `check.yml` 只运行测试和构建，权限为只读，不再使用 `DEPLOY_KEY` 或推送第二仓库。旧测试仓库与旧密钥是否归档/撤销由组织管理员另行处理；本轮没有修改远端设置。

## 域名与登录

计划沿用 `www.hzyzzw.com`。先在 Pages 项目中添加该自定义域名，再按控制台要求在阿里 DNS 配置 CNAME，等 Cloudflare 完成域名与证书验证。只改 CNAME 而未在 Pages 绑定域名并不完整。根域名 `hzyzzw.com` 如也需访问，应单独选择受支持的绑定或跳转方式；当前未假设阿里 DNS 已具备根域扁平化能力。

CMS 配置中的网站地址为 `https://www.hzyzzw.com`，鉴权地址继续使用现有 `https://sveltia-cms-auth.asanokiri.workers.dev`。CMS 和鉴权 Worker 是独立部署，前台不需要新建业务 Worker。

正式切换前核对现有 Worker 的允许来源/站点配置、GitHub OAuth App 和回调地址是否覆盖正式域名。不要把客户端密钥写进仓库。用组织中具有该仓库写权限的测试账号完成一次“登录 → 编辑一条经确认的内容 → 发布 → Pages 成功 → 前台出现”联调。当前本地构建不能替代这一步。

## 换届交接

代码留在 GitHub 组织，日常维护者加入映研部对应团队并授予仓库写权限。组织 Owner 至少保留两名适任负责人，普通编辑者不需要组织最高权限。若给 `main` 设置必须走 PR 的分支保护，CMS 直接发布会被阻止；需要同步调整内容发布方式，不能单独改其中一端。

在飞书交接文档记录：仓库与团队、Cloudflare 项目与账户负责人、Worker/OAuth App 负责人、阿里 DNS 与域名续费负责人、后台入口、恢复流程。账户归属与恢复方式应可由下一届接管，不在公开仓库记录口令或恢复码。

网站回退可使用 Pages 控制台上一成功部署；内容修改可在 GitHub 撤销对应提交。回退后还要修正源数据，防止下一次构建再次发布错误内容。

## 上线前验收

- 现任干部确认部门介绍、发展年份、角色署名和旧图来源，更新公开联系方式。
- 运行 `npm ci`、`npm test`、`npm run build`，检查手机和桌面预览。
- 更新 Pages 构建产物目录，验证子页面刷新、主题持久化和 `/admin/`。
- 验证正式域名 HTTPS 与现有 CMS 登录发布，再决定上线。

本轮只修改本地源码，没有推送、发布或修改 DNS/Cloudflare/OAuth 设置。
