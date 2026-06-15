import { useGame } from '../game/store';
import { EXPERIMENT_RECIPES, getItem } from '../game/content';

export function CodexPanel() {
  const discovered = useGame((s) => s.discovered);
  const stats = useGame((s) => s.stats);

  const total = EXPERIMENT_RECIPES.length;
  const found = EXPERIMENT_RECIPES.filter((r) => discovered.includes(r.id));
  const pct = Math.round((found.length / total) * 100);

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 16 }}>
        <span className="ic" style={{ background: 'color-mix(in srgb, #c08ae0 30%, var(--panel-3))' }}>📖</span>
        <div>
          <h2>Codex</h2>
          <div className="blurb">Every blend you coax out of the elements is recorded here.</div>
        </div>
        <div className="lvtag">
          <b>{found.length}/{total}</b>
          <small>combinations · {pct}%</small>
        </div>
      </div>
      <div className="lvbar"><span style={{ width: `${pct}%` }} /></div>

      <div className="stats-row">
        <div className="stat-tile"><b>{stats.discoveries}</b><small>discoveries</small></div>
        <div className="stat-tile"><b>{stats.itemsMade.toLocaleString()}</b><small>things made</small></div>
        <div className="stat-tile"><b>{stats.ordersFilled}</b><small>orders filled</small></div>
      </div>

      <div className="section-label" style={{ marginTop: 18 }}>Combination web</div>
      <div className="recipe-grid">
        {EXPERIMENT_RECIPES.map((r) => {
          const known = discovered.includes(r.id);
          const out = getItem(r.outputs[0].item);
          return (
            <div key={r.id} className={`recipe${known ? '' : ' locked'}`} style={{ gap: 7 }}>
              <div className="top">
                <span className="ic">{known ? out.icon : '❔'}</span>
                <span className="nm">{known ? out.name : '???'}</span>
                <span className="dur">Lv {r.levelReq}</span>
              </div>
              {known ? (
                <div className="io">
                  {r.inputs.map((i) => {
                    const ii = getItem(i.item);
                    return (
                      <span key={i.item} className="chip"><span>{ii.icon}</span>{i.qty > 1 && <span className="q">×{i.qty}</span>}</span>
                    );
                  })}
                  <span className="arrow">→</span>
                  <span className="chip"><span>{out.icon}</span><span>{out.name}</span></span>
                </div>
              ) : (
                <div className="io" style={{ color: 'var(--faint)' }}>undiscovered — try it in the crucible</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
