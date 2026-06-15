import { useGame } from '../game/store';
import { getItem } from '../game/content';
import { baseId, keyGrade, quality } from '../game/quality';
import { fmtTime } from './common';

const KIND_ORDER = ['token', 'mote', 'ingredient', 'essence', 'material', 'tool', 'vessel', 'product', 'byproduct'];

export function Sidebar() {
  const inventory = useGame((s) => s.inventory);
  const log = useGame((s) => s.log);
  const compost = useGame((s) => s.compostMuddle);
  const playSeconds = useGame((s) => s.playSeconds);

  const entries = Object.entries(inventory)
    .filter(([, q]) => q > 0)
    .map(([key, q]) => {
      const base = baseId(key);
      return { key, qty: q, grade: keyGrade(key), def: getItem(base) };
    })
    .sort(
      (a, b) =>
        KIND_ORDER.indexOf(a.def.kind) - KIND_ORDER.indexOf(b.def.kind) ||
        a.def.tier - b.def.tier ||
        a.grade - b.grade,
    );

  const hasMuddle = (inventory.muddle ?? 0) > 0;

  return (
    <aside className="sidebar">
      <section className="card side-card">
        <h3>🎒 Larder <span className="count">{entries.length} kinds</span></h3>
        {entries.length === 0 ? (
          <div className="inv-empty">Nothing yet — head to Foraging and begin gathering.</div>
        ) : (
          <div className="inv-grid">
            {entries.map(({ key, qty, grade, def }) => {
              const q = grade >= 0 ? quality(grade) : null;
              return (
                <div
                  className="inv-cell"
                  key={key}
                  title={`${def.name}${q ? ` (${q.name})` : ''}${def.blurb ? ' — ' + def.blurb : ''}`}
                >
                  {def.color && <span className="dot" style={{ background: def.color }} />}
                  {q && <span className="grade" style={{ color: q.color }}>{q.short}</span>}
                  <span className="em">{def.icon}</span>
                  <span className="q">{fmtQty(qty)}</span>
                </div>
              );
            })}
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
              <span>{e.text}</span>{' '}
              <span className="t">· {fmtTime(playSeconds - e.at) === '0s' ? 'now' : fmtTime(playSeconds - e.at) + ' ago'}</span>
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
