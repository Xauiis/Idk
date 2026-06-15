import { useGame } from '../game/store';
import { BIOMES, RECIPES, SKILL_BY_ID, getItem } from '../game/content';

export function MapPanel() {
  const biomes = useGame((s) => s.biomes);
  const coins = useGame((s) => s.coins);
  const rep = useGame((s) => s.reputation);
  const unlock = useGame((s) => s.unlockBiome);

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 16 }}>
        <span className="ic" style={{ background: 'color-mix(in srgb, #86c07c 30%, var(--panel-3))' }}>🗺️</span>
        <div>
          <h2>World Map</h2>
          <div className="blurb">Chart new biomes to widen the ingredients you can gather.</div>
        </div>
        <div className="lvtag"><b>{biomes.length}</b><small>of {BIOMES.length} charted</small></div>
      </div>

      <div className="recipe-grid">
        {BIOMES.map((b) => {
          const owned = biomes.includes(b.id);
          const gathers = RECIPES.filter((r) => r.biome === b.id);
          const skills = [...new Set(gathers.map((r) => r.skill))];
          const affordRep = rep >= b.repReq;
          const affordCoins = coins >= b.cost;
          return (
            <div key={b.id} className={`recipe${owned ? ' active' : ''}`} style={{ gap: 9 }}>
              <div className="top">
                <span className="ic" style={{ background: `color-mix(in srgb, ${b.color} 30%, var(--panel-3))` }}>{b.icon}</span>
                <span className="nm">{b.name}</span>
              </div>
              <div className="story" style={{ fontStyle: 'normal' }}>{b.blurb}</div>
              <div className="io">
                {skills.map((s) => <span key={s} className="chip"><span>{SKILL_BY_ID[s].icon}</span>{SKILL_BY_ID[s].name}</span>)}
              </div>
              <div className="io">
                {gathers.slice(0, 6).map((r) => {
                  const out = getItem(r.outputs[0].item);
                  return <span key={r.id} className="chip" title={out.name}>{out.icon}</span>;
                })}
              </div>
              {owned ? (
                <button className="sel stop" disabled>✓ Charted</button>
              ) : (
                <button
                  className="sel"
                  disabled={!affordRep || !affordCoins}
                  style={!affordRep || !affordCoins ? { opacity: 0.55 } : undefined}
                  onClick={() => unlock(b.id)}
                  title={!affordRep ? `Needs ${b.repReq} reputation` : !affordCoins ? `Needs ${b.cost} coins` : ''}
                >
                  {affordRep ? `🪙 ${b.cost}` : `❤ ${b.repReq} rep needed`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
