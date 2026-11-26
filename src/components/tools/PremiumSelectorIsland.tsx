import { useMemo, useState } from 'preact/hooks';

interface BrandLite {
  id: string;
  name: string;
  tagline: string;
  deviceLimit?: string;
  lineTypes?: string[];
  aiTools?: string[];
  streaming?: string[];
  supportChannels?: string[];
  evidenceCompleteness: number;
}

interface PlanLite {
  id: string;
  brandId: string;
  brandName: string;
  planName: string;
  cycle: string;
  months: number | null;
  price: number;
  monthlyEquivalent: number | null;
  trafficGb: number | null;
}

interface Props {
  brands: BrandLite[];
  plans: PlanLite[];
}

export default function PremiumSelectorIsland({ brands, plans }: Props) {
  const [monthlyBudget, setMonthlyBudget] = useState(50);
  const [totalBudget, setTotalBudget] = useState(300);
  const [scenario, setScenario] = useState<'ai' | 'streaming' | 'business' | 'general'>('business');
  const [minDevices, setMinDevices] = useState(3);
  const [minTrafficGb, setMinTrafficGb] = useState(100);
  const [requireDedicatedClaim, setRequireDedicatedClaim] = useState(true);

  const evaluation = useMemo(() => {
    const matched: Array<{ plan: PlanLite; brand: BrandLite; reasons: string[] }> = [];
    const partial: Array<{ plan: PlanLite; brand: BrandLite; gaps: string[] }> = [];

    brands.forEach((b) => {
      const brandPlans = plans.filter((p) => p.brandId === b.id && p.cycle !== 'one-time');
      if (brandPlans.length === 0) return;

      const hasDedicated = (b.lineTypes || []).some((l) => /IEPL|IPLC/i.test(l));
      const hasAi = (b.aiTools || []).length > 0;
      const hasStreaming = (b.streaming || []).length > 0;
      const unlimitedDev = /不限/.test(b.deviceLimit || '');

      const candidatePlan =
        brandPlans.find(
          (p) =>
            (p.monthlyEquivalent ?? p.price) <= monthlyBudget &&
            p.price <= totalBudget &&
            (p.trafficGb ?? 0) >= minTrafficGb
        ) || brandPlans[0];

      const gaps: string[] = [];
      const reasons: string[] = [];

      const eqPrice = candidatePlan.monthlyEquivalent ?? candidatePlan.price;
      if (eqPrice > monthlyBudget) gaps.push(`月均 ¥${eqPrice} 超出月度预算 ¥${monthlyBudget}`);
      else reasons.push(`月均 ¥${eqPrice} 符合月度预算`);

      if (candidatePlan.price > totalBudget) gaps.push(`整期实付 ¥${candidatePlan.price} 超出整期预算 ¥${totalBudget}`);
      else reasons.push(`整期实付 ¥${candidatePlan.price}`);

      if ((candidatePlan.trafficGb ?? 0) < minTrafficGb) {
        gaps.push(`月流量 ${candidatePlan.trafficGb ?? '未标'} GB 低于需求 ${minTrafficGb} GB`);
      } else {
        reasons.push(`流量 ${candidatePlan.trafficGb} GB`);
      }

      if (requireDedicatedClaim && !hasDedicated) gaps.push('未见 IEPL/IPLC 专线公开声明');
      else if (hasDedicated) reasons.push('具备 IEPL/IPLC 专线公开声明（待独立实证）');

      if (scenario === 'ai' && !hasAi) gaps.push('未见明确 AI 工具兼容声明');
      if (scenario === 'streaming' && !hasStreaming) gaps.push('未见明确流媒体兼容声明');
      if (minDevices > 3 && !unlimitedDev) gaps.push(`设备限制：${b.deviceLimit || '未明示'}`);

      if (gaps.length === 0) {
        matched.push({ plan: candidatePlan, brand: b, reasons });
      } else if (gaps.length <= 2) {
        partial.push({ plan: candidatePlan, brand: b, gaps });
      }
    });

    return { matched, partial };
  }, [brands, plans, monthlyBudget, totalBudget, scenario, minDevices, minTrafficGb, requireDedicatedClaim]);

  return (
    <div class="imperial-card" style="padding:1.6rem;">
      <div class="grid-3" style="gap:1rem;margin-bottom:1.25rem;">
        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          月均预算上限 (元/月)
          <input
            type="number"
            min="5"
            max="2000"
            value={monthlyBudget}
            onInput={(e) => setMonthlyBudget(Number((e.target as HTMLInputElement).value) || 0)}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          单次整期付款预算 (元)
          <input
            type="number"
            min="10"
            max="10000"
            value={totalBudget}
            onInput={(e) => setTotalBudget(Number((e.target as HTMLInputElement).value) || 0)}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          主要使用场景
          <select
            value={scenario}
            onChange={(e) => setScenario((e.target as HTMLSelectElement).value as any)}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          >
            <option value="business">国际商务与远程办公</option>
            <option value="ai">AI 工具高频研究</option>
            <option value="streaming">4K / 8K 高端流媒体</option>
            <option value="general">综合高稳定性需求</option>
          </select>
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          同时在线设备数量
          <input
            type="number"
            min="1"
            max="20"
            value={minDevices}
            onInput={(e) => setMinDevices(Number((e.target as HTMLInputElement).value) || 1)}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          每月预计流量需求 (GB)
          <input
            type="number"
            min="20"
            max="5000"
            step="20"
            value={minTrafficGb}
            onInput={(e) => setMinTrafficGb(Number((e.target as HTMLInputElement).value) || 20)}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.86rem;font-weight:600;padding-top:1.4rem;">
          <input
            type="checkbox"
            checked={requireDedicatedClaim}
            onChange={(e) => setRequireDedicatedClaim((e.target as HTMLInputElement).checked)}
          />
          要求具备 IEPL/IPLC 专线公开声明
        </label>
      </div>

      <div style="border-top:1px solid var(--border-silver);padding-top:1.2rem;">
        <h3 style="margin:0 0 0.75rem;font-size:1.05rem;">
          符合条件的历史套餐记录（{evaluation.matched.length} 项）
        </h3>
        {evaluation.matched.length > 0 ? (
          <div class="grid-2" style="gap:0.9rem;margin-bottom:1.25rem;">
            {evaluation.matched.slice(0, 6).map(({ brand, plan, reasons }) => (
              <div key={plan.id} class="imperial-card" style="padding:1rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
                  <a href={`/airports/${brand.id}/`} style="font-weight:700;font-size:1rem;">
                    {brand.name} · {plan.planName}
                  </a>
                  <span class="evidence-pill">完整度 {brand.evidenceCompleteness}%</span>
                </div>
                <div style="font-size:0.86rem;color:var(--deep-gilt);font-weight:700;margin:0.35rem 0;">
                  整期实付 ¥{plan.price}（约 ¥{plan.monthlyEquivalent ?? plan.price}/月 · {plan.trafficGb ?? '未标'} GB）
                </div>
                <div style="font-size:0.82rem;color:var(--text-muted);">
                  匹配项：{reasons.join('；')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div class="imperial-card" style="padding:1rem;margin-bottom:1.25rem;border-color:var(--imperial-gold);">
            <strong>当前条件下无完全匹配的服务套餐。</strong>
            <p style="margin:0.4rem 0 0;font-size:0.88rem;color:var(--text-muted);">
              依据本站不强行推荐的原则：您设置的预算、流量或专线条件在现有 18 家品牌历史数据中暂无完全契合项。请参考下方「部分匹配项目及差距原因」，或适当调整预算与流量阈值。
            </p>
          </div>
        )}

        {evaluation.partial.length > 0 && (
          <>
            <h3 style="margin:0 0 0.75rem;font-size:1rem;color:var(--text-secondary);">
              部分匹配项目及差距说明（{evaluation.partial.length} 项）
            </h3>
            <div class="grid-2" style="gap:0.85rem;">
              {evaluation.partial.slice(0, 4).map(({ brand, plan, gaps }) => (
                <div key={plan.id} class="imperial-card" style="padding:0.95rem;">
                  <a href={`/airports/${brand.id}/`} style="font-weight:700;">{brand.name} · {plan.planName}（¥{plan.price}）</a>
                  <div style="font-size:0.82rem;color:var(--text-muted);margin-top:0.3rem;">
                    未完全满足原因：{gaps.join('；')}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
