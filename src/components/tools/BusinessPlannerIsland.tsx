import { useMemo, useState } from 'preact/hooks';

interface BrandLite {
  id: string;
  name: string;
  deviceLimit?: string;
  aiTools?: string[];
  lineTypes?: string[];
}

interface Props {
  brands: BrandLite[];
}

export default function BusinessPlannerIsland({ brands }: Props) {
  const [teamSize, setTeamSize] = useState(5);
  const [devicesPerPerson, setDevicesPerPerson] = useState(2);
  const [meetingHoursDaily, setMeetingHoursDaily] = useState(2);
  const [usesAi, setUsesAi] = useState(true);
  const [largeFileTransfer, setLargeFileTransfer] = useState(true);
  const [continuityLevel, setContinuityLevel] = useState<'standard' | 'high' | 'critical'>('high');

  const plan = useMemo(() => {
    const totalDevices = teamSize * devicesPerPerson;
    const perPersonMbps = (meetingHoursDaily > 0 ? 8 : 3) + (largeFileTransfer ? 15 : 4);
    const recommendedAggregateMbps = teamSize * perPersonMbps;
    const monthlyTrafficPerPersonGb = Math.round(
      (meetingHoursDaily * 3.2 + (usesAi ? 1.5 : 0.4) + (largeFileTransfer ? 8 : 2)) * 22
    );
    const totalMonthlyGb = monthlyTrafficPerPersonGb * teamSize;

    const unlimitedDeviceBrands = brands.filter((b) => /不限/.test(b.deviceLimit || ''));
    return {
      totalDevices,
      recommendedAggregateMbps,
      monthlyTrafficPerPersonGb,
      totalMonthlyGb,
      unlimitedDeviceBrands,
    };
  }, [teamSize, devicesPerPerson, meetingHoursDaily, usesAi, largeFileTransfer, brands]);

  return (
    <div class="imperial-card" style="padding:1.6rem;">
      <div class="grid-3" style="gap:1rem;margin-bottom:1.25rem;">
        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          团队人数
          <input
            type="number"
            min="1"
            max="200"
            value={teamSize}
            onInput={(e) => setTeamSize(Math.max(1, Number((e.target as HTMLInputElement).value) || 1))}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          人均办公设备数（电脑/手机/平板）
          <input
            type="number"
            min="1"
            max="10"
            value={devicesPerPerson}
            onInput={(e) => setDevicesPerPerson(Math.max(1, Number((e.target as HTMLInputElement).value) || 1))}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          日均海外视频会议时长 (小时)
          <input
            type="number"
            min="0"
            max="12"
            step="0.5"
            value={meetingHoursDaily}
            onInput={(e) => setMeetingHoursDaily(Math.max(0, Number((e.target as HTMLInputElement).value) || 0))}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
        </label>

        <label style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.86rem;font-weight:600;">
          服务连续性要求
          <select
            value={continuityLevel}
            onChange={(e) => setContinuityLevel((e.target as HTMLSelectElement).value as any)}
            style="padding:0.55rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          >
            <option value="standard">标准（单主线 + 按需切换节点）</option>
            <option value="high">高可用（双服务商主备冗余）</option>
            <option value="critical">关键任务（建议正规企业专线 / SD-WAN + 商业SLA）</option>
          </select>
        </label>

        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.86rem;font-weight:600;padding-top:1.2rem;">
          <input type="checkbox" checked={usesAi} onChange={(e) => setUsesAi((e.target as HTMLInputElement).checked)} />
          高频使用 AI 工具（ChatGPT / Claude / Gemini）
        </label>

        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.86rem;font-weight:600;padding-top:1.2rem;">
          <input type="checkbox" checked={largeFileTransfer} onChange={(e) => setLargeFileTransfer((e.target as HTMLInputElement).checked)} />
          包含大文件传输 / 云端代码同步
        </label>
      </div>

      <div class="grid-4" style="gap:0.85rem;margin-bottom:1.25rem;">
        <div class="imperial-card" style="padding:1rem;">
          <div style="font-size:0.78rem;color:var(--text-muted);">总接入设备规模</div>
          <div style="font-size:1.4rem;font-weight:800;">{plan.totalDevices} 台</div>
        </div>
        <div class="imperial-card" style="padding:1rem;">
          <div style="font-size:0.78rem;color:var(--text-muted);">估算聚合峰值带宽</div>
          <div style="font-size:1.4rem;font-weight:800;color:var(--deep-gilt);">{plan.recommendedAggregateMbps} Mbps</div>
        </div>
        <div class="imperial-card" style="padding:1rem;">
          <div style="font-size:0.78rem;color:var(--text-muted);">人均月流量参考</div>
          <div style="font-size:1.4rem;font-weight:800;">{plan.monthlyTrafficPerPersonGb} GB</div>
        </div>
        <div class="imperial-card" style="padding:1rem;">
          <div style="font-size:0.78rem;color:var(--text-muted);">团队月度总流量参考</div>
          <div style="font-size:1.4rem;font-weight:800;color:var(--deep-gilt);">{plan.totalMonthlyGb} GB</div>
        </div>
      </div>

      <div class="imperial-card" style="padding:1.1rem;border-color:var(--imperial-gold);margin-bottom:1rem;">
        <strong>重要合规与安全边界提示：</strong>
        <p style="margin:0.4rem 0 0;font-size:0.88rem;line-height:1.65;">
          个人机场订阅属于消费级代理服务，<strong>不具备企业级 SLA、SOC2/ISO27001 合规认证或数据加密审计保障</strong>。
          {continuityLevel === 'critical'
            ? ' 您的连续性等级为「关键任务」，建议优先采购具备正式商业合同与 SLA 的企业专线或 SD-WAN 方案，个人机场仅可作为非敏感业务的辅助参考。'
            : ' 建议为关键业务配备两家不同上游的备用连接，禁止将多人团队账号直接共享单一个体套餐（易触发风控或违反服务条款）。'}
        </p>
      </div>

      <div style="font-size:0.88rem;">
        <strong>公开资料标注「不限同时在线设备数」的个人服务参考（共 {plan.unlimitedDeviceBrands.length} 家）：</strong>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.55rem;">
          {plan.unlimitedDeviceBrands.map((b) => (
            <a key={b.id} href={`/airports/${b.id}/`} class="evidence-pill" style="text-decoration:none;">
              {b.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
