import { useMemo, useState } from 'preact/hooks';

interface PlanSummary {
  id: string;
  brandId: string;
  brandName: string;
  planName: string;
  cycle: string;
  price: number;
  trafficGb: number | null;
}

interface Props {
  plans: PlanSummary[];
}

export default function StreamingCalcIsland({ plans }: Props) {
  const [preset, setPreset] = useState<'1080p' | '4k' | '8k'>('4k');
  const [bitrateMbps, setBitrateMbps] = useState<number>(25);
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [devices, setDevices] = useState<number>(1);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(30);
  const [multiplier, setMultiplier] = useState<number>(1);

  const applyPreset = (p: '1080p' | '4k' | '8k') => {
    setPreset(p);
    if (p === '1080p') setBitrateMbps(8);
    if (p === '4k') setBitrateMbps(25);
    if (p === '8k') setBitrateMbps(80);
  };

  // Exact formula required by specification:
  // 理论总码率Mbps = 单路平均视频码率 × 同时播放数量
  // 预计月流量GB = 理论总码率 × 每日观看小时 × 3600 × 使用天数 ÷ 8000 (decimal GB)
  const calc = useMemo(() => {
    const totalMbps = bitrateMbps * devices;
    const baseMonthlyGb = (totalMbps * dailyHours * 3600 * daysPerMonth) / 8000;
    const billedMonthlyGb = baseMonthlyGb * multiplier;
    const recommendedBandwidthMbps = Math.ceil(totalMbps * 1.4);
    return {
      totalMbps,
      baseMonthlyGb: Number(baseMonthlyGb.toFixed(1)),
      billedMonthlyGb: Number(billedMonthlyGb.toFixed(1)),
      recommendedBandwidthMbps,
    };
  }, [bitrateMbps, devices, dailyHours, daysPerMonth, multiplier]);

  const matchingPlans = useMemo(() => {
    return plans
      .filter((p) => p.cycle === 'monthly' && p.trafficGb && p.trafficGb >= calc.billedMonthlyGb)
      .sort((a, b) => a.price - b.price)
      .slice(0, 6);
  }, [plans, calc.billedMonthlyGb]);

  return (
    <div class="imperial-card" style="padding:1.6rem;">
      <div style="display:flex;flex-wrap:wrap;gap:0.6rem;margin-bottom:1.25rem;align-items:center;">
        <span style="font-weight:700;font-size:0.9rem;">画质参考预设（可自由修改平均码率）：</span>
        {(['1080p', '4k', '8k'] as const).map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => applyPreset(p)}
            class={`btn-imperial ${preset === p ? 'btn-primary-gold' : 'btn-secondary-platinum'}`}
            style="min-height:38px;padding:0.35rem 0.95rem;font-size:0.84rem;"
          >
            {p.toUpperCase()} 参考估值
          </button>
        ))}
      </div>

      <div class="grid-3" style="gap:1rem;margin-bottom:1.4rem;">
        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.88rem;font-weight:600;">
          单路平均视频码率 (Mbps)
          <input
            type="number"
            min="1"
            max="300"
            value={bitrateMbps}
            onInput={(e) => setBitrateMbps(Math.max(1, Number((e.target as HTMLInputElement).value) || 1))}
            style="padding:0.55rem 0.75rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">4K/8K 码率因平台与编码而异，非固定单一数值</span>
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.88rem;font-weight:600;">
          同时播放设备数量
          <input
            type="number"
            min="1"
            max="20"
            value={devices}
            onInput={(e) => setDevices(Math.max(1, Number((e.target as HTMLInputElement).value) || 1))}
            style="padding:0.55rem 0.75rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.88rem;font-weight:600;">
          每日观看时长 (小时)
          <input
            type="number"
            min="0.5"
            max="24"
            step="0.5"
            value={dailyHours}
            onInput={(e) => setDailyHours(Math.max(0.5, Number((e.target as HTMLInputElement).value) || 0.5))}
            style="padding:0.55rem 0.75rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.88rem;font-weight:600;">
          每月使用天数
          <input
            type="number"
            min="1"
            max="31"
            value={daysPerMonth}
            onInput={(e) => setDaysPerMonth(Math.min(31, Math.max(1, Number((e.target as HTMLInputElement).value) || 30)))}
            style="padding:0.55rem 0.75rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.88rem;font-weight:600;">
          套餐节点计费倍率
          <select
            value={multiplier}
            onChange={(e) => setMultiplier(Number((e.target as HTMLSelectElement).value))}
            style="padding:0.55rem 0.75rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          >
            <option value={1}>1.0x（常规单倍计费）</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x（部分专线节点倍率）</option>
            <option value={3}>3.0x</option>
          </select>
        </label>
      </div>

      <div class="grid-4" style="gap:0.85rem;margin-bottom:1.4rem;">
        <div class="imperial-card" style="padding:1rem;">
          <div style="font-size:0.78rem;color:var(--text-muted);">理论总码率</div>
          <div style="font-size:1.45rem;font-weight:800;color:var(--deep-gilt);">{calc.totalMbps} Mbps</div>
        </div>
        <div class="imperial-card" style="padding:1rem;">
          <div style="font-size:0.78rem;color:var(--text-muted);">建议带宽余量 (+40%)</div>
          <div style="font-size:1.45rem;font-weight:800;">{calc.recommendedBandwidthMbps} Mbps</div>
        </div>
        <div class="imperial-card" style="padding:1rem;">
          <div style="font-size:0.78rem;color:var(--text-muted);">预计月耗流量 (1x 十进制GB)</div>
          <div style="font-size:1.45rem;font-weight:800;">{calc.baseMonthlyGb} GB</div>
        </div>
        <div class="imperial-card" style="padding:1rem;">
          <div style="font-size:0.78rem;color:var(--text-muted);">计入倍率后所需套餐流量</div>
          <div style="font-size:1.45rem;font-weight:800;color:var(--deep-gilt);">{calc.billedMonthlyGb} GB</div>
        </div>
      </div>

      <div style="font-size:0.84rem;color:var(--text-muted);margin-bottom:1rem;">
        计算公式：理论总码率 = 单路码率 × 设备数；预计月流量(GB) = 理论总码率 × 每日小时 × 3600 × 天数 ÷ 8000（十进制 GB）。实际消耗受码率波动、传输开销及其他后台活动影响。
      </div>

      <h3 style="font-size:1rem;margin:0 0 0.75rem;">满足上述月流量（≥ {calc.billedMonthlyGb} GB）的历史月付套餐参考：</h3>
      {matchingPlans.length > 0 ? (
        <div class="grid-3" style="gap:0.85rem;">
          {matchingPlans.map((p) => (
            <a href={`/airports/${p.brandId}/`} class="imperial-card diamond-hover" style="padding:0.95rem;display:block;">
              <div style="font-weight:700;">{p.brandName} · {p.planName}</div>
              <div style="font-size:0.86rem;color:var(--text-muted);margin-top:0.25rem;">
                历史月付：¥{p.price} / {p.trafficGb} GB
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p style="font-size:0.9rem;color:var(--text-muted);margin:0;">
          当前数据库月付标准套餐中暂无单月流量 ≥ {calc.billedMonthlyGb} GB 的低价方案，建议降低观看时长、选择 1x 倍率节点或联系服务商确认大流量定制套餐。
        </p>
      )}
    </div>
  );
}
