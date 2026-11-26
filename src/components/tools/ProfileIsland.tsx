import { useEffect, useState } from 'preact/hooks';
import { clearProfile, loadProfile, saveProfile, type PrestigeProfile } from '../../lib/profileStore';

interface BrandLite {
  id: string;
  name: string;
  tagline: string;
}

interface Props {
  brands: BrandLite[];
}

export default function ProfileIsland({ brands }: Props) {
  const [profile, setProfile] = useState<PrestigeProfile | null>(null);
  const [notes, setNotes] = useState('');
  const [budgetLabel, setBudgetLabel] = useState('');
  const [budgetAmount, setBudgetAmount] = useState(50);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setNotes(p.notes || '');
  }, []);

  if (!profile) {
    return <div class="imperial-card">正在读取本地皇家档案...</div>;
  }

  const favBrandObjs = brands.filter((b) => profile.favoriteBrands.includes(b.id));

  const saveNotes = () => {
    const updated = { ...profile, notes };
    saveProfile(updated);
    setProfile(updated);
  };

  const addBudget = () => {
    if (!budgetLabel.trim()) return;
    const updated = {
      ...profile,
      budgetRecords: [
        { id: String(Date.now()), label: budgetLabel.trim(), monthlyBudget: budgetAmount, createdAt: new Date().toISOString().slice(0, 10) },
        ...profile.budgetRecords,
      ],
    };
    saveProfile(updated);
    setProfile(updated);
    setBudgetLabel('');
  };

  const handleClear = () => {
    const fresh = clearProfile();
    setProfile(fresh);
    setNotes('');
  };

  return (
    <div style="display:grid;gap:1.5rem;">
      <div class="imperial-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.75rem;">
          <h2 style="margin:0;font-size:1.2rem;">已收藏精品品牌 ({favBrandObjs.length})</h2>
          <a href="/airports/" class="btn-imperial btn-secondary-platinum" style="min-height:36px;padding:0.3rem 0.9rem;font-size:0.84rem;">
            浏览全部 18 家品牌
          </a>
        </div>
        {favBrandObjs.length > 0 ? (
          <div class="grid-3" style="gap:0.85rem;">
            {favBrandObjs.map((b) => (
              <div key={b.id} class="imperial-card" style="padding:1rem;">
                <a href={`/airports/${b.id}/`} style="font-weight:700;font-size:1rem;">{b.name}</a>
                <p style="font-size:0.82rem;color:var(--text-muted);margin:0.35rem 0 0.75rem;">{b.tagline}</p>
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...profile,
                      favoriteBrands: profile.favoriteBrands.filter((id) => id !== b.id),
                    };
                    saveProfile(updated);
                    setProfile(updated);
                  }}
                  class="icon-btn"
                >
                  取消收藏
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style="color:var(--text-muted);margin:0;">尚未收藏任何品牌。在任意品牌档案页点击「收藏至我的皇家档案」即可本地保存。</p>
        )}
      </div>

      <div class="imperial-card">
        <h2 style="margin:0 0 0.75rem;font-size:1.2rem;">套餐预算记录</h2>
        <div style="display:flex;flex-wrap:wrap;gap:0.6rem;margin-bottom:1rem;">
          <input
            type="text"
            value={budgetLabel}
            onInput={(e) => setBudgetLabel((e.target as HTMLInputElement).value)}
            placeholder="预算用途（如：商务主线 + 备用节点）"
            style="flex:1;min-width:200px;padding:0.5rem 0.8rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
          <input
            type="number"
            min="1"
            value={budgetAmount}
            onInput={(e) => setBudgetAmount(Number((e.target as HTMLInputElement).value) || 0)}
            style="width:120px;padding:0.5rem 0.8rem;border-radius:8px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);"
          />
          <button type="button" onClick={addBudget} class="btn-imperial btn-primary-gold" style="min-height:40px;padding:0.4rem 1rem;">
            记录预算
          </button>
        </div>
        {profile.budgetRecords.length > 0 && (
          <ul style="margin:0;padding-left:1.2rem;display:grid;gap:0.4rem;">
            {profile.budgetRecords.map((r) => (
              <li key={r.id}>
                <strong>{r.label}</strong>：¥{r.monthlyBudget}/月（{r.createdAt}）
              </li>
            ))}
          </ul>
        )}
      </div>

      <div class="imperial-card">
        <h2 style="margin:0 0 0.75rem;font-size:1.2rem;">个人选购笔记（仅存于本机浏览器）</h2>
        <textarea
          rows={4}
          value={notes}
          onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
          placeholder="记录您关注的线路条件、退款条款、客服询问结果或备用方案..."
          style="width:100%;padding:0.75rem;border-radius:10px;border:1px solid var(--border-gold);background:var(--bg-primary);color:var(--text-primary);font-family:inherit;margin-bottom:0.75rem;"
        />
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button type="button" onClick={saveNotes} class="btn-imperial btn-primary-gold" style="min-height:40px;">
            保存笔记
          </button>
          <button type="button" onClick={handleClear} class="btn-imperial btn-secondary-platinum" style="min-height:40px;">
            清除全部本地数据
          </button>
        </div>
      </div>
    </div>
  );
}
