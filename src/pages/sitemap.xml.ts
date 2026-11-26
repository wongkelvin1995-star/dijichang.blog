import type { APIRoute } from 'astro';
import { brands } from '../lib/data';
import { articles } from '../data/articles';
import { topicPages } from '../data/topics';

export const GET: APIRoute = () => {
  const baseUrl = 'https://dijichang.blog';
  const lastmod = '2026-11-26';

  const staticPaths = [
    '/',
    '/premium/',
    '/rankings/',
    '/rankings/methodology/',
    '/lines/',
    '/regions/',
    '/performance/',
    '/performance/evidence/',
    '/ai/',
    '/ai/compatibility/',
    '/streaming/',
    '/business/',
    '/plans/',
    '/guide/',
    '/airports/',
    '/tools/',
    '/tools/premium-selector/',
    '/tools/line-matrix/',
    '/tools/streaming-calculator/',
    '/tools/business-planner/',
    '/tools/service-compare/',
    '/articles/',
    '/updates/',
    '/faq/',
    '/about/',
    '/contact/',
    '/disclosure/',
    '/privacy/',
  ];

  const allUrls = new Set<string>([
    ...staticPaths,
    ...topicPages.map((t) => t.path),
    ...brands.map((b) => `/airports/${b.id}/`),
    ...articles.map((a) => `/articles/${a.slug}/`),
  ]);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(allUrls)
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
