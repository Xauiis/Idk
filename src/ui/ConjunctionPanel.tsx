import { useState } from 'react';
import { useGame } from '../game/store';
import { ELEMENTS, ITEMS, getItem } from '../game/content';
import { ProcessPanel } from './ProcessPanel';

export function ConjunctionPanel() {
  const inventory = useGame((s) => s.inventory);
  const experiment = useGame((s) => s.experiment);
  const [sel, setSel] = useState<Record<string, number>>({});

  // Essences you currently hold can also go into the crucible (for compound discoveries).
  const essenceIds = ITEMS.filter((i) => i.kind === 'essence' && (inventory[i.id] ?? 0) > 0).map((i) => i.id);

  const total = Object.values(sel).reduce((a, b) => a + (b ?? 0), 0);
  const bump = (id: string, d: number) =>
    setSel((prev) => {
      const have = inventory[id] ?? 0;
      const next = Math.max(0, Math.min(have, (prev[id] ?? 0) + d));
      return { ...prev, [id]: next };
    });

  const brew = () => {
    if (total === 0) return;
    experiment(sel);
    setSel({});
  };

  return (
    <div>
      <div className="section-label">Experiment — drop motes (and essences) into the crucible</div>
      <div className="elem-rack">
        {ELEMENTS.map((e) => {
          const have = inventory[e.moteId] ?? 0;
          const n = sel[e.moteId] ?? 0;
          return (
            <div className="elem" key={e.id}>
              <div className="e-head">
                <span className="e-glyph" style={{ background: e.color }}>{e.glyph}</span>
                <span className="e-name">{e.name}</span>
                <span className="e-have">have {have}</span>
              </div>
              <div className="stepper">
                <button onClick={() => bump(e.moteId, -1)} disabled={n <= 0}>−</button>
                <span className="n" style={{ color: n > 0 ? e.color : 'var(--faint)' }}>{n}</span>
                <button onClick={() => bump(e.moteId, +1)} disabled={n >= have}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      {essenceIds.length > 0 && (
        <>
          <div className="section-label">Essences on hand — combine these into compounds</div>
          <div className="elem-rack">
            {essenceIds.map((id) => {
              const item = getItem(id);
              const have = inventory[id] ?? 0;
              const n = sel[id] ?? 0;
              return (
                <div className="elem" key={id}>
                  <div className="e-head">
                    <span className="e-glyph" style={{ background: item.color ?? 'var(--panel-3)' }}>{item.icon}</span>
                    <span className="e-name" style={{ fontSize: 12 }}>{item.name}</span>
                    <span className="e-have">have {have}</span>
                  </div>
                  <div className="stepper">
                    <button onClick={() => bump(id, -1)} disabled={n <= 0}>−</button>
                    <span className="n" style={{ color: n > 0 ? (item.color ?? 'var(--text)') : 'var(--faint)' }}>{n}</span>
                    <button onClick={() => bump(id, +1)} disabled={n >= have}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="brew-row">
        <div className="cauldron">
          {total === 0 ? (
            <span>The crucible is empty…</span>
          ) : (
            Object.entries(sel).filter(([, q]) => q > 0).map(([id, q]) => {
              const item = getItem(id);
              return (
                <span key={id} className="chip" style={{ borderColor: item.color }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                  <span>{item.name}</span>
                  <span className="q">×{q}</span>
                </span>
              );
            })
          )}
        </div>
        <button className="btn btn-primary" disabled={total === 0} onClick={brew}>✦ Combine</button>
      </div>
      <p className="tip">
        An unknown-but-valid blend becomes a <b>discovery</b>; nonsense becomes harmless Muddle. Discovered
        recipes can be set to run automatically below — and essences can be combined into deeper compounds.
      </p>

      <div className="section-label" style={{ marginTop: 22 }}>Known combinations — set one running</div>
      <ProcessPanel skill="conjunction" />
    </div>
  );
}
