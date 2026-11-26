import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.error('dist/ directory not found! Run npm run build first.');
  process.exit(1);
}

const keywords = JSON.parse(fs.readFileSync('data/seo-keywords.json', 'utf8'));
const brands = JSON.parse(fs.readFileSync('data/brands/index.json', 'utf8'));

// 1. Check all 106 SEO keyword target URLs resolve to real HTML files in dist/
const uniqueUrls = Array.from(new Set(keywords.map((k) => k.targetUrl)));
const missingUrls = [];
for (const u of uniqueUrls) {
  const filePath = u === '/' ? path.join(distDir, 'index.html') : path.join(distDir, u.replace(/^\/|\/$/g, ''), 'index.html');
  if (!fs.existsSync(filePath)) {
    missingUrls.push({ url: u, expectedFile: filePath });
  }
}

// 2. Check all 18 brand pages + AFF URLs + coupons
const missingBrands = [];
for (const b of brands) {
  const f = path.join(distDir, 'airports', b.id, 'index.html');
  if (!fs.existsSync(f)) {
    missingBrands.push(b.id);
  } else {
    const html = fs.readFileSync(f, 'utf8');
    if (!html.includes(b.affiliateUrl)) {
      missingBrands.push(`${b.id} (missing AFF URL)`);
    }
    if (b.coupon?.code && !html.includes(b.coupon.code)) {
      missingBrands.push(`${b.id} (missing coupon ${b.coupon.code})`);
    }
  }
}

// 3. Check homepage SEO & content
const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const hasTitle = homeHtml.includes('顶级机场｜2027高端机场推荐、精品专线与全球优质节点选购指南');
const hasH1 = homeHtml.includes('顶级机场：高端专线、优质节点与服务品质选购指南');
const hasCanonical = homeHtml.includes('https://dijichang.blog/');
const textOnly = homeHtml.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, '');
const cjkCount = (textOnly.match(/[\u4e00-\u9fff]/g) || []).length;

// 4. Check sitemap.xml & robots.txt
const sitemapExists = fs.existsSync(path.join(distDir, 'sitemap.xml'));
const robotsExists = fs.existsSync(path.join(distDir, 'robots.txt'));
const sitemapXml = sitemapExists ? fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8') : '';
const sitemapUrlCount = (sitemapXml.match(/<loc>/g) || []).length;
const sitemapExcludesPrivate = !sitemapXml.includes('/search/') && !sitemapXml.includes('/profile/');

console.log('=== VERIFICATION SUMMARY ===');
console.log('SEO Target URLs checked:', uniqueUrls.length, '| Missing:', missingUrls.length);
if (missingUrls.length) console.log('Missing URLs:', missingUrls);
console.log('Brands checked:', brands.length, '| Issues:', missingBrands.length);
if (missingBrands.length) console.log('Brand issues:', missingBrands);
console.log('Homepage checks:', { hasTitle, hasH1, hasCanonical, cjkCharCount: cjkCount });
console.log('Technical SEO:', { sitemapExists, robotsExists, sitemapUrlCount, sitemapExcludesPrivate });

if (missingUrls.length > 0 || missingBrands.length > 0 || !hasTitle || !hasH1 || !hasCanonical || !sitemapExists || !robotsExists || !sitemapExcludesPrivate) {
  process.exit(1);
}
console.log('ALL CHECKS PASSED!');
