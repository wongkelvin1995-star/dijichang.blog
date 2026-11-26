import { useState } from 'preact/hooks';

interface CompareBrand {
  id: string;
  name: string;
  ratio?: string;
  deviceLimit?: string;
  lineTypes?: string[];
  aiTools?: string[];
  streaming?: string[];
  supportChannels?: string[];
  refundPolicy: string;
  trialPolicy: string;
  evidenceCompleteness: number;
  plans: Array<{
    id: string;
    planName: string;
    cycle: string;
    price: number;
    monthlyEquivalent: number | null;
    trafficGb: number | null;
  }>;
}

interface Props {
  brands: CompareBrand[];
}

export default function ServiceCompareIsland({ brands }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    brands.slice(0, 3).map((b) => b.id)
  );
  const [selectedPlanByBrand, setSelectedPlanByBrand] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    brands.forEach((b) => {
      if (b.plans[0]) init[b.id] = b.plans[0].id;
    });
    return init;
  });

  const toggleBrand = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) return;
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length >= 4) return;
      setSelectedIds([...selectedIds, id]);
    }
  };

  const chosen = brands.filter((b) => selectedIds.includes(b.id));

  return (
    <div class="imperial-card" style="padding:1.5rem;">
      <div style="margin-bottom:1rem;">
        <div style="font-weight:700;margin-bottom:0.5rem;">选择 2–4 家品牌进行多维套餐与服务对比（数据统一读取自核心数据库）：</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
          {brands.map((b) => {
            const active = selectedIds.includes(b.id);
            return (
              <button
                type="button"
                key={b.id}
                onClick={() => toggleBrand(b.id)}
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
                {b.name}
              </button>
            );
          })}
        </div>
      </div>

      <div class="table-scroll">
        <table class="imperial-table">
          <thead>
            <tr>
              <th>对比项目</th>
              {chosen.map((b) => (
                <th key={b.id}>
                  <a href={`/airports/${b.id}/`} style="text-decoration:underline;">{b.name}</a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>选择对比套餐</strong></td>
              {chosen.map((b) => (
                <td key={b.id}>
                  <select
                    value={selectedPlanByBrand[b.id] || ''}
                    onChange={(e) =>
                      setSelectedPlanByBrand({
                        ...selectedPlanByBrand,
                        [b.id]: (e.target as HTMLSelectElement).value,
                      })
                    }
                    style="width:100%;max-width:210px;padding:0.35rem;border-radius:6px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);font-size:0.82rem;"
                  >
                    {b.plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.planName} ({p.cycle}) - ¥{p.price}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>整期实际售价</strong></td>
              {chosen.map((b) => {
                const p = b.plans.find((x) => x.id === selectedPlanByBrand[b.id]) || b.plans[0];
                return <td key={b.id}><strong>{p ? `¥${p.price}` : '无数据'}</strong></td>;
              })}
            </tr>
            <tr>
              <td><strong>折合每月价格</strong></td>
              {chosen.map((b) => {
                const p = b.plans.find((x) => x.id === selectedPlanByBrand[b.id]) || b.plans[0];
                return <td key={b.id}>{p?.monthlyEquivalent ? `约 ¥${p.monthlyEquivalent}/月` : '一次性/不适用'}</td>;
              })}
            </tr>
            <tr>
              <td><strong>套餐流量额度</strong></td>
              {chosen.map((b) => {
                const p = b.plans.find((x) => x.id === selectedPlanByBrand[b.id]) || b.plans[0];
                return <td key={b.id}>{p?.trafficGb ? `${p.trafficGb} GB` : '未标明'}</td>;
              })}
            </tr>
            <tr>
              <td><strong>流量计费倍率</strong></td>
              {chosen.map((b) => <td key={b.id}>{b.ratio || '未明示'}</td>)}
            </tr>
            <tr>
              <td><strong>同时在线设备限制</strong></td>
              {chosen.map((b) => <td key={b.id}>{b.deviceLimit || '未明示'}</td>)}
            </tr>
            <tr>
              <td><strong>线路公开声明</strong></td>
              {chosen.map((b) => <td key={b.id}>{b.lineTypes?.join('、') || '未明示'}</td>)}
            </tr>
            <tr>
              <td><strong>性能实测证据</strong></td>
              {chosen.map((b) => <td key={b.id}><span class="evidence-pill warn">暂无独立多日实测</span></td>)}
            </tr>
            <tr>
              <td><strong>AI 兼容声明</strong></td>
              {chosen.map((b) => <td key={b.id}>{b.aiTools?.join('、') || '未单独列出'}</td>)}
            </tr>
            <tr>
              <td><strong>流媒体兼容声明</strong></td>
              {chosen.map((b) => <td key={b.id}>{b.streaming?.join('、') || '未单独列出'}</td>)}
            </tr>
            <tr>
              <td><strong>客服渠道</strong></td>
              {chosen.map((b) => <td key={b.id}>{b.supportChannels?.join('、') || '未明示'}</td>)}
            </tr>
            <tr>
              <td><strong>试用与退款政策</strong></td>
              {chosen.map((b) => <td key={b.id}>{b.trialPolicy}；{b.refundPolicy}</td>)}
            </tr>
            <tr>
              <td><strong>资料证据完整度</strong></td>
              {chosen.map((b) => <td key={b.id}><strong>{b.evidenceCompleteness}%</strong></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
