import { useGame } from '../game/store';
import { ITEMS } from '../game/content';
import { fmtTime } from './common';

const KIND_ORDER = ['mote', 'ingredient', 'essence', 'product', 'byproduct'];

export function Sidebar() {
  const inventory = useGame((s) => s.inventory);
  const log = useGame((s) => s.log);
  const compost = useGame((s) => s.compostMuddle);
  const playSeconds = useGame((s) => s.playSeconds);

  const entries = ITEMS
    .filter((it) => (inventory[it.id] ?? 0) > 0)
    .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.tier - b.tier);

  const hasMuddle = (inventory.muddle ?? 0) > 0;

  return (
    <aside className="sidebar">
      <section className="card side-card">
        <h3>🎒 Larder <span className="count">{entries.length} kinds</span></h3>
        {entries.length === 0 ? (
          <div className="inv-empty">Nothing yet — head to Foraging and begin gathering.</div>
        ) : (
          <div className="inv-grid">
            {entries.map((it) => (
              <div className="inv-cell" key={it.id} title={`${it.name}${it.blurb ? ' — ' + it.blurb : ''}`}>
                {it.color && <span className="dot" style={{ background: it.color }} />}
                <span className="em">{it.icon}</span>
                <span className="q">{fmtQty(inventory[it.id])}</span>
              </div>
            ))}
          </div>
        )}
        {hasMuddle && (
          <button className="btn btn-ghost" style={{ marginTop: 10, width: '100%' }} onClick={compost}>
            ♻ Compost Muddle → Terra
          </button>
        )}
      </section>

      <section className="card side-card">
        <h3>📜 Activity</h3>
        <div className="log">
          {log.length === 0 && <div className="inv-empty">Your day begins…</div>}
          {log.map((e) => (
            <div className={`entry ${e.tone}`} key={e.id}>
              <span>{e.text}</span> <span className="t">· {fmtTime(playSeconds - e.at) === '0s' ? 'now' : fmtTime(playSeconds - e.at) + ' ago'}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function fmtQty(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(Math.floor(n));
}
