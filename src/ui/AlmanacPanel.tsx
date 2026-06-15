import { useGame } from '../game/store';
import { ACHIEVEMENTS, EXPERIMENT_RECIPES, BIOMES, PERKS, LINE_SKILLS, coziness, type AchMetric } from '../game/content';
import { levelForXp } from '../game/xp';

export function AlmanacPanel() {
  const s = useGame();

  const totalLevel = LINE_SKILLS.concat('hospitality').reduce((sum, k) => sum + levelForXp(s.skillXp[k]), 0);
  const skills99 = (Object.keys(s.skillXp) as (keyof typeof s.skillXp)[]).filter((k) => levelForXp(s.skillXp[k]) >= 99).length;
  const metrics: Record<AchMetric, number> = {
    totalLevel,
    skills99,
    biomes: s.biomes.length,
    discovered: s.discovered.length,
    ordersFilled: s.stats.ordersFilled,
    itemsMade: s.stats.itemsMade,
    coziness: coziness(s.inventory),
    coins: Math.floor(s.coins),
    decorPlaced: 0,
    perks: s.perks.length,
  };

  const earned = ACHIEVEMENTS.filter((a) => metrics[a.metric] >= a.goal).length;
  const pct = Math.round((earned / ACHIEVEMENTS.length) * 100);

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 16 }}>
        <span className="ic" style={{ background: 'color-mix(in srgb, #e7c46b 30%, var(--panel-3))' }}>🏆</span>
        <div>
          <h2>Almanac</h2>
          <div className="blurb">Your shop's story so far — milestones, mastery and the long, cozy road to completion.</div>
        </div>
        <div className="lvtag"><b>{earned}/{ACHIEVEMENTS.length}</b><small>{pct}% complete</small></div>
      </div>
      <div className="lvbar"><span style={{ width: `${pct}%` }} /></div>

      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-tile"><b>{totalLevel}</b><small>total level</small></div>
        <div className="stat-tile"><b>{s.discovered.length}/{EXPERIMENT_RECIPES.length}</b><small>combinations</small></div>
        <div className="stat-tile"><b>{s.biomes.length}/{BIOMES.length}</b><small>biomes</small></div>
        <div className="stat-tile"><b>{s.perks.length}/{PERKS.length}</b><small>research</small></div>
      </div>

      <div className="section-label" style={{ marginTop: 18 }}>Achievements</div>
      <div className="recipe-grid">
        {ACHIEVEMENTS.map((a) => {
          const have = metrics[a.metric];
          const done = have >= a.goal;
          const prog = Math.min(1, have / a.goal);
          return (
            <div key={a.id} className={`recipe${done ? ' active' : ' locked'}`} style={{ gap: 7 }}>
              <div className="top">
                <span className="ic">{done ? a.icon : '🔒'}</span>
                <span className="nm">{a.name}</span>
                {done && <span className="xp" style={{ marginLeft: 'auto' }}>✓</span>}
              </div>
              <div className="story" style={{ fontStyle: 'normal' }}>{a.desc}</div>
              <div className="bar"><span style={{ width: `${prog * 100}%`, background: done ? 'var(--good)' : 'var(--accent)' }} /></div>
              <div className="xp" style={{ color: 'var(--muted)' }}>{Math.min(have, a.goal).toLocaleString()} / {a.goal.toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
