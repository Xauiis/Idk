import { useState } from 'react';
import { useGame } from '../game/store';
import { getItem, ELEMENTS } from '../game/content';
import { baseId, keyGrade, quality } from '../game/quality';
import { fmtTime } from './common';

const KIND_ORDER = ['token', 'mote', 'ingredient', 'essence', 'material', 'tool', 'vessel', 'product', 'byproduct'];
const KIND_LABEL: Record<string, string> = {
  token: 'Token', mote: 'Element mote', ingredient: 'Ingredient', essence: 'Essence',
  material: 'Material', tool: 'Tool', decor: 'Decor', vessel: 'Vessel', product: 'Product', byproduct: 'Byproduct',
};

export function Sidebar() {
  const inventory = useGame((s) => s.inventory);
  const log = useGame((s) => s.log);
  const [inspect, setInspect] = useState<string | null>(null);
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
                  role="button"
                  tabIndex={0}
                  onClick={() => setInspect(key)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setInspect(key); }}
                  title={`${def.name}${q ? ` (${q.name})` : ''} — click to inspect`}
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

      {inspect && <ItemInspect itemKey={inspect} onClose={() => setInspect(null)} />}
    </aside>
  );
}

function ItemInspect({ itemKey, onClose }: { itemKey: string; onClose: () => void }) {
  const def = getItem(baseId(itemKey));
  const grade = keyGrade(itemKey);
  const q = grade >= 0 ? quality(grade) : null;
  const comp = def.composition;
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="card modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left', width: 'min(360px, 92vw)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 34 }}>{def.icon}</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{def.name}{q ? ` · ${q.name}` : ''}</h2>
            <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{KIND_LABEL[def.kind] ?? def.kind} · tier {def.tier}</div>
          </div>
        </div>
        {def.blurb && <p style={{ color: 'var(--muted)', fontStyle: 'italic', margin: '12px 0' }}>“{def.blurb}”</p>}
        {comp && (
          <div style={{ margin: '8px 0' }}>
            <div className="section-label" style={{ margin: '0 0 6px' }}>Separates into</div>
            <div className="io">
              {ELEMENTS.filter((e) => comp[e.id]).map((e) => (
                <span key={e.id} className="chip" style={{ borderColor: e.color }}>
                  <span style={{ color: e.color }}>{e.glyph}</span><span>{e.name}</span><span className="q">×{comp[e.id]}</span>
                </span>
              ))}
            </div>
          </div>
        )}
        {def.value > 0 && <div style={{ fontSize: 13, color: 'var(--muted)' }}>Base value: 🪙 {q ? Math.round(def.value * q.valueMult) : def.value}</div>}
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function fmtQty(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(Math.floor(n));
}
