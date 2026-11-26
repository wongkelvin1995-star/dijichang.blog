import { useMemo, useState } from 'preact/hooks';

export interface SearchItem {
  id: string;
  category:
    | '品牌'
    | '精品套餐'
    | '线路知识'
    | '全球节点'
    | '应用研究'
    | '商务办公'
    | '专业文章'
    | '独家工具';
  title: string;
  subtitle: string;
  url: string;
  keywords: string;
}

interface Props {
  items: SearchItem[];
  compact?: boolean;
}

const SYNONYMS: Record<string, string[]> = {
  专线: ['iepl', 'iplc', 'bgp', '中转'],
  iepl: ['专线', 'iplc'],
  iplc: ['专线', 'iepl'],
  原生ip: ['原生', '住宅ip', '美国', '解锁'],
  ai: ['chatgpt', 'claude', 'gemini', 'openai'],
  chatgpt: ['ai', 'openai', '原生ip'],
  claude: ['ai', 'anthropic'],
  gemini: ['ai', 'google'],
  流媒体: ['netflix', 'disney', 'youtube', '4k', '8k'],
  '4k': ['流媒体', 'youtube', 'netflix', '带宽'],
  '8k': ['流媒体', 'youtube', '带宽'],
  商务: ['办公', '视频会议', '团队', 'mac', 'windows', '路由器'],
  退款: ['试用', '售后', '政策', '升级'],
  年付: ['月付', '套餐', '价格'],
};

const HOT_TERMS = [
  '灵动云',
  'FlyV',
  'IEPL',
  'IPLC',
  '原生IP',
  '香港',
  '晚高峰',
  'ChatGPT',
  '4K',
  '商务',
  '年付',
  '退款',
];

export default function SmartSearchIsland({ items, compact = false }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const expandedTokens = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return [];
    const parts = raw.split(/\s+/).filter(Boolean);
    const all = new Set<string>(parts);
    parts.forEach((p) => {
      const syns = SYNONYMS[p];
      if (syns) syns.forEach((s) => all.add(s));
    });
    return Array.from(all);
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return activeCategory === '全部'
        ? items.slice(0, compact ? 8 : 24)
        : items.filter((i) => i.category === activeCategory).slice(0, 24);
    }
    const rawLower = query.trim().toLowerCase();
    return items
      .map((item) => {
        const hay = `${item.title} ${item.subtitle} ${item.keywords} ${item.category}`.toLowerCase();
        let score = 0;
        if (hay.includes(rawLower)) score += 10;
        expandedTokens.forEach((tk) => {
          if (item.title.toLowerCase().includes(tk)) score += 5;
          else if (hay.includes(tk)) score += 2;
        });
        return { item, score };
      })
      .filter((x) => x.score > 0)
      .filter((x) => activeCategory === '全部' || x.item.category === activeCategory)
      .sort((a, b) => b.score - a.score)
      .slice(0, compact ? 10 : 48)
      .map((x) => x.item);
  }, [query, activeCategory, items, expandedTokens, compact]);

  const categories = ['全部', '品牌', '精品套餐', '线路知识', '全球节点', '应用研究', '商务办公', '专业文章', '独家工具'];

  return (
    <div class="imperial-card" style="padding:1.5rem;">
      <div style="display:flex;flex-direction:column;gap:0.85rem;">
        <label for="imperial-smart-search" style="font-weight:700;font-size:0.95rem;">
          ORION · 铂金智核全站检索（支持中文模糊、英文大小写、优惠码、线路、地区与同义词）
        </label>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
          <input
            id="imperial-smart-search"
            type="search"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            placeholder="输入关键词：如 灵动云、FlyV、IEPL、IPLC、原生IP、香港、晚高峰、ChatGPT、4K、商务、年付、退款..."
            style="flex:1;min-width:220px;min-height:46px;padding:0.65rem 1rem;border-radius:999px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);font-size:0.95rem;"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              class="btn-imperial btn-secondary-platinum"
              style="min-height:46px;"
            >
              清空
            </button>
          )}
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:0.45rem;align-items:center;">
          <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">重点测试词：</span>
          {HOT_TERMS.map((term) => (
            <button
              type="button"
              key={term}
              onClick={() => setQuery(term)}
              style="padding:0.25rem 0.65rem;border-radius:999px;border:1px solid var(--border-gold);background:rgba(198,166,106,0.1);color:var(--text-primary);font-size:0.78rem;cursor:pointer;"
            >
              {term}
            </button>
          ))}
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-silver)',
                background: activeCategory === cat ? 'var(--royal-navy)' : 'transparent',
                color: activeCategory === cat ? '#F8F6F0' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style="font-size:0.84rem;color:var(--text-muted);">
          {query.trim()
            ? `已匹配 ${results.length} 条可访问结果（含同义词扩展：${expandedTokens.join(' / ')}）`
            : `当前显示 ${results.length} 条精选索引（输入关键词即时联想）`}
        </div>

        <div class="grid-2" style="gap:0.85rem;">
          {results.map((r) => (
            <a
              key={r.id}
              href={r.url}
              class="imperial-card diamond-hover"
              style="padding:1rem;display:flex;flex-direction:column;gap:0.3rem;text-decoration:none;"
            >
              <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
                <span class="evidence-pill">{r.category}</span>
                <span style="font-size:0.75rem;color:var(--deep-gilt);font-weight:700;">访问 →</span>
              </div>
              <div style="font-weight:700;font-size:0.98rem;color:var(--text-primary);">{r.title}</div>
              <div style="font-size:0.83rem;color:var(--text-muted);line-height:1.5;">{r.subtitle}</div>
            </a>
          ))}
        </div>
        {results.length === 0 && (
          <div style="padding:1.5rem;text-align:center;color:var(--text-muted);">
            未找到匹配「{query}」的资料。请尝试缩短关键词或切换分类。
          </div>
        )}
      </div>
    </div>
  );
}
