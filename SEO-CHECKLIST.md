# SEO-CHECKLIST.md · Bing 技术 SEO 与运营核查清单

## 技术 SEO 配置状态
- [x] 每页独立 `<title>` 与 `<meta name="description">`
- [x] 每页唯一 `<h1>` 与合理 `<h2>`/`<h3>` 层级
- [x] Canonical 规范 URL（`https://dijichang.blog/...`）
- [x] `sitemap.xml`（仅收录 HTTP 200 可索引内容页，排除 `/search/`、`/profile/`、`/404`）
- [x] `robots.txt`（允许抓取正文，屏蔽 `/search/` 与 `/profile/`）
- [x] Open Graph & Twitter/X Metadata（原创 `og-imperial.svg`）
- [x] 结构化数据：`WebSite`、`BreadcrumbList`、`Article`（无虚假评分与库存）
- [x] 推广链接规范：`rel="sponsored noopener noreferrer"` + `/disclosure/`
- [x] 自定义 `404.astro` 迷路主题页

## Bing Webmaster Tools 线上部署后待办（不可虚报已完成）
1. 在 https://www.bing.com/webmasters/ 添加 `https://dijichang.blog/` 并生成真实 `BingSiteAuth.xml` 放入 `public/`。
2. 提交 `https://dijichang.blog/sitemap.xml`。
3. 生成真实 IndexNow 密钥文件 `<KEY>.txt` 放置于站点根目录后，再通过 IndexNow API 提交真实新增/更新 URL。
4. 连续观察 28 天+ Search Performance、URL Inspection、Site Scan 与核心关键词自然展现/点击/CTR。
