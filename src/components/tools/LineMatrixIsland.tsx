import { useState } from 'preact/hooks';

interface LineItem {
  brandId: string;
  brandName: string;
  declaredLineTypes: string[];
  hasIeplClaim: boolean;
  hasIplcClaim: boolean;
  hasBgpClaim: boolean;
  independentVerificationStatus: string;
  ratio: string;
}

interface Props {
  lines: LineItem[];
}

export default function LineMatrixIsland({ lines }: Props) {
  const [selected, setSelected] = useState<string[]>(
    lines.slice(0, 3).map((l) => l.brandId)
  );

  const toggleBrand = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length <= 2) return;
      setSelected(selected.filter((x) => x !== id));
    } else {
      if (selected.length >= 4) return;
      setSelected([...selected, id]);
    }
  };

  const chosen = lines.filter((l) => selected.includes(l.brandId));

  return (
    <div class="imperial-card" style="padding:1.5rem;">
      <div style="margin-bottom:1rem;">
        <div style="font-weight:700;margin-bottom:0.5rem;">选择 2–4 家品牌对比线路资料（当前已选 {selected.length} 家）：</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
          {lines.map((l) => {
            const active = selected.includes(l.brandId);
            return (
              <button
                type="button"
                key={l.brandId}
                onClick={() => toggleBrand(l.brandId)}
                style={{
                  padding: '0.32rem 0.72rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-gold)',
                  background: active ? 'var(--royal-navy)' : 'transparent',
                  color: active ? '#F8F6F0' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {l.brandName}
              </button>
            );
          })}
        </div>
      </div>

      <div class="table-scroll">
        <table class="imperial-table">
          <thead>
            <tr>
              <th>对比维度</th>
              {chosen.map((c) => (
                <th key={c.brandId}>
                  <a href={`/airports/${c.brandId}/`} style="text-decoration:underline;">{c.brandName}</a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>服务商线路声明</strong></td>
              {chosen.map((c) => (
                <td key={c.brandId}>{c.declaredLineTypes.join('、') || '未见明确声明'}</td>
              ))}
            </tr>
            <tr>
              <td><strong>IEPL 声明</strong></td>
              {chosen.map((c) => (
                <td key={c.brandId}>{c.hasIeplClaim ? '有公开声明' : '未明确提及'}</td>
              ))}
            </tr>
            <tr>
              <td><strong>IPLC 声明</strong></td>
              {chosen.map((c) => (
                <td key={c.brandId}>{c.hasIplcClaim ? '有公开声明' : '未明确提及'}</td>
              ))}
            </tr>
            <tr>
              <td><strong>BGP 中转资料</strong></td>
              {chosen.map((c) => (
                <td key={c.brandId}>{c.hasBgpClaim ? '有公开声明' : '未单独标注'}</td>
              ))}
            </tr>
            <tr>
              <td><strong>节点计费倍率</strong></td>
              {chosen.map((c) => (
                <td key={c.brandId}>{c.ratio}</td>
              ))}
            </tr>
            <tr>
              <td><strong>独立核验状态</strong></td>
              {chosen.map((c) => (
                <td key={c.brandId}>
                  <span class="evidence-pill warn">{c.independentVerificationStatus}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p style="font-size:0.82rem;color:var(--text-muted);margin:0.85rem 0 0;">
        专业提示：仅凭节点名称、IP 地址、Traceroute 结果或单次测速均无法证明线路属于真实 IEPL/IPLC 物理专线。
      </p>
    </div>
  );
}
