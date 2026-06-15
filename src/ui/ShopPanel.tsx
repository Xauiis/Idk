import { useGame } from '../game/store';
import { UPGRADES } from '../game/content';

export function ShopPanel() {
  const coins = useGame((s) => s.coins);
  const owned = useGame((s) => s.upgrades);
  const buy = useGame((s) => s.buyUpgrade);

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 16 }}>
        <span className="ic" style={{ background: 'color-mix(in srgb, #e7c46b 30%, var(--panel-3))' }}>🛒</span>
        <div>
          <h2>Apothecary Upgrades</h2>
          <div className="blurb">Spend coins on fittings that make every line hum a little faster.</div>
        </div>
        <div className="lvtag"><b>{Math.floor(coins)}</b><small>coins</small></div>
      </div>

      <div className="recipe-grid">
        {UPGRADES.map((u) => {
          const has = owned.includes(u.id);
          const afford = coins >= u.cost;
          return (
            <div key={u.id} className={`recipe${has ? ' active' : ''}`} style={{ gap: 9 }}>
              <div className="top">
                <span className="ic">{u.icon}</span>
                <span className="nm">{u.name}</span>
              </div>
              <div className="io" style={{ color: 'var(--muted)' }}>{u.effectText}</div>
              {has ? (
                <button className="sel stop" disabled>✓ Installed</button>
              ) : (
                <button
                  className="sel"
                  style={!afford ? { opacity: 0.5 } : undefined}
                  disabled={!afford}
                  onClick={() => buy(u.id)}
                >
                  🪙 {u.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
