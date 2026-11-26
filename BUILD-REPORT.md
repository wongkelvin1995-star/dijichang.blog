# BUILD-REPORT.md · 顶级机场 (dijichang.blog) 生产环境构建与核验报告

构建日期：2026-11-26（UTC+8）

## 1. 构建与类型检查结果
- `npx tsc --noEmit`：通过（Exit code 0）。
- `npm run build`（Astro 5.18.2 静态生成）：通过（152 个页面构建完成，耗时 22.08s）。
- `node scripts/verify-site.mjs`：通过（全部核验项无缺失）。

## 2. 数据库与内容统计（真实核验值）
- 已收录品牌数：18 家（`data/brands/index.json`）
- 具备正式评选资格品牌数：0 家（因尚缺独立多日性能实测与 ASN 专线审计，严格不强行生成榜单）
- 已核验历史套餐记录：329 条（`data/plans/index.json`）
- 线路公开声明记录：18 份（独立链路实证：0 份）
- 性能实测记录：0 份（独立实测由 `jichangshice.mom` 负责）
- 原创研究文章：30 篇（`/articles/`）
- 首页完整 FAQ：40 项（全部输出至 HTML）
- 首页中文字符统计：`10,580` 字（含 30 个内容模块及 40 项 FAQ 正文）

## 3. SEO 与技术架构核验
- 100 个原始关键词 + 6 个扩展词共 85 个去重目标 URL：`Missing: 0`
- `sitemap.xml`：已生成，共收录 `149` 个 HTTP 200 可索引页面，已排除 `/search/`、`/profile/` 与 `/404.html`。
- `robots.txt`：已生成并配置 `Disallow: /search/` 与 `Disallow: /profile/`。
- 18 家品牌独立档案页：全部包含原始 AFF 推广链接（`rel="sponsored noopener noreferrer"`）与原始优惠码。

## 4. 待线上部署后执行事项（不虚报已完成）
- 本次构建在本地离线静态环境完成，尚未部署至线上 HTTPS 域名 `https://dijichang.blog/`，因此尚未执行线上 Lighthouse 跑分、真机浏览器截图、BingSiteAuth.xml 密钥验证及 IndexNow 线上提交。
