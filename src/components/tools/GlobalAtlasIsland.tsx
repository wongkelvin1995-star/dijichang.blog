import { useState } from 'preact/hooks';

interface RegionBrand {
  brandId: string;
  brandName: string;
  declaredNodeCount: number | null;
  declaredLines: string[];
  evidenceNature: string;
}

interface RegionItem {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  role: string;
  brandCount: number;
  brands: RegionBrand[];
  note: string;
}

interface Props {
  regions: RegionItem[];
}

export default function GlobalAtlasIsland({ regions }: Props) {
  const [activeId, setActiveId] = useState(regions[0]?.id || 'hong-kong');
  const current = regions.find((r) => r.id === activeId) || regions[0];

  return (
    <div class="imperial-card" style="padding:1.5rem;">
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.25rem;">
        {regions.map((r) => (
          <button
            type="button"
            key={r.id}
            onClick={() => setActiveId(r.id)}
            class={`btn-imperial ${r.id === activeId ? 'btn-primary-gold' : 'btn-secondary-platinum'}`}
            style="min-height:40px;padding:0.4rem 1rem;font-size:0.86rem;"
          >
            {r.name}（{r.brandCount}家声明覆盖）
          </button>
        ))}
      </div>

      {current && (
        <div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
            <div>
              <h3 style="margin:0;font-size:1.25rem;">
                {current.name} · {current.nameEn}
              </h3>
              <p style="margin:0.25rem 0 0;color:var(--text-muted);font-size:0.9rem;">{current.role}</p>
            </div>
            <a href={current.slug} class="btn-imperial btn-secondary-platinum" style="min-height:38px;padding:0.35rem 0.95rem;font-size:0.84rem;">
              查看{current.name}专题研究 →
            </a>
          </div>

          <div class="grid-3" style="gap:0.85rem;margin-bottom:1rem;">
            {current.brands.map((b) => (
              <a
                key={b.brandId}
                href={`/airports/${b.brandId}/`}
                class="imperial-card diamond-hover"
                style="padding:0.95rem;display:block;"
              >
                <div style="font-weight:700;font-size:0.98rem;">{b.brandName}</div>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-top:0.25rem;">
                  声明节点数：{b.declaredNodeCount !== null ? `${b.declaredNodeCount} 个` : '未单独拆分'}
                </div>
                <div style="font-size:0.8rem;color:var(--deep-gilt);margin-top:0.2rem;">
                  {b.declaredLines.join('、') || '常规节点'}
                </div>
              </a>
            ))}
          </div>

          <p style="font-size:0.8rem;color:var(--text-muted);margin:0;">{current.note}</p>
        </div>
      )}
    </div>
  );
}
