import { useGame } from '../game/store';
import { PERKS, PERK_BY_ID } from '../game/content';
import { ProcessPanel } from './ProcessPanel';

export function LorePanel() {
  const insight = useGame((s) => s.inventory.insight ?? 0);
  const owned = useGame((s) => s.perks);
  const buy = useGame((s) => s.buyPerk);

  return (
    <div>
      <div className="section-label">Study — turn samples into Insight</div>
      <ProcessPanel skill="lore" />

      <div className="section-label" style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>Research Log — spend Insight on permanent breakthroughs</span>
        <span className="insight-pill" style={{ marginLeft: 'auto' }}>💡 {Math.floor(insight)}</span>
      </div>
      <div className="research-grid">
        {PERKS.map((p) => {
          const has = owned.includes(p.id);
          const blocked = p.requires && !owned.includes(p.requires);
          const afford = insight >= p.cost;
          return (
            <div key={p.id} className={`perk${has ? ' owned' : ''}${blocked ? ' locked' : ''}`}>
              <div className="top">
                <span className="ic">{p.icon}</span>
                <span className="nm">{p.name}</span>
              </div>
              <div className="desc">{p.desc}</div>
              {blocked && <div className="req">needs: {PERK_BY_ID[p.requires!]?.name}</div>}
              {has ? (
                <button className="sel stop" disabled>✓ Researched</button>
              ) : (
                <button className="sel" disabled={!afford || !!blocked} style={!afford || blocked ? { opacity: 0.5 } : undefined} onClick={() => buy(p.id)}>
                  💡 {p.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
