import { useState } from 'react';
import { useGame } from '../game/store';
import { ELEMENTS } from '../game/content';
import type { ElementId } from '../game/types';
import { ProcessPanel } from './ProcessPanel';

export function ConjunctionPanel() {
  const inventory = useGame((s) => s.inventory);
  const experiment = useGame((s) => s.experiment);
  const [sel, setSel] = useState<Partial<Record<ElementId, number>>>({});

  const total = Object.values(sel).reduce((a, b) => a + (b ?? 0), 0);
  const set = (el: ElementId, d: number) =>
    setSel((prev) => {
      const have = inventory[ELEMENTS.find((e) => e.id === el)!.moteId] ?? 0;
      const cur = prev[el] ?? 0;
      const next = Math.max(0, Math.min(have, cur + d));
      return { ...prev, [el]: next };
    });

  const brew = () => {
    if (total === 0) return;
    experiment(sel);
    setSel({});
  };

  return (
    <div>
      <div className="section-label">Experiment — drop element motes into the crucible</div>
      <div className="elem-rack">
        {ELEMENTS.map((e) => {
          const have = inventory[e.moteId] ?? 0;
          const n = sel[e.id] ?? 0;
          return (
            <div className="elem" key={e.id}>
              <div className="e-head">
                <span className="e-glyph" style={{ background: e.color }}>{e.glyph}</span>
                <span className="e-name">{e.name}</span>
                <span className="e-have">have {have}</span>
              </div>
              <div className="stepper">
                <button onClick={() => set(e.id, -1)} disabled={n <= 0}>−</button>
                <span className="n" style={{ color: n > 0 ? e.color : 'var(--faint)' }}>{n}</span>
                <button onClick={() => set(e.id, +1)} disabled={n >= have}>+</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="brew-row">
        <div className="cauldron">
          {total === 0 ? (
            <span>The crucible is empty…</span>
          ) : (
            ELEMENTS.filter((e) => (sel[e.id] ?? 0) > 0).map((e) => (
              <span key={e.id} className="chip" style={{ borderColor: e.color }}>
                <span style={{ color: e.color }}>{e.glyph}</span>
                <span>{e.name}</span>
                <span className="q">×{sel[e.id]}</span>
              </span>
            ))
          )}
        </div>
        <button className="btn btn-primary" disabled={total === 0} onClick={brew}>✦ Combine</button>
      </div>
      <p className="tip">
        Unknown-but-valid blends become a <b>discovery</b>; nonsense becomes harmless Muddle. Once discovered,
        a recipe can be set to run automatically below.
      </p>

      <div className="section-label" style={{ marginTop: 22 }}>Known combinations — set one running</div>
      <ProcessPanel skill="conjunction" />
    </div>
  );
}
