import { useGame } from '../game/store';
import { SKILL_BY_ID, getItem, RECIPE_BY_ID } from '../game/content';
import { allLines, itemFlows, labSummary, type LineStatus } from '../game/analytics';
import type { SkillId } from '../game/types';

const STATUS: Record<LineStatus, { label: string; color: string }> = {
  running: { label: 'running', color: 'var(--good)' },
  paused: { label: 'paused', color: 'var(--gold)' },
  stalled: { label: 'stalled', color: 'var(--danger)' },
  idle: { label: 'idle', color: 'var(--faint)' },
};

export function LabPanel({ onSelect }: { onSelect: (s: string) => void }) {
  const s = useGame();
  const lines = allLines(s);
  const flows = itemFlows(s).filter((f) => Math.abs(f.net) > 0.01);
  const sum = labSummary(lines);

  const savePreset = () => {
    const name = window.prompt('Name this line preset:', `Setup ${s.presets.length + 1}`);
    if (name !== null) s.savePreset(name);
  };

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 14 }}>
        <span className="ic" style={{ background: 'color-mix(in srgb, #c08ae0 30%, var(--panel-3))' }}>🏚️</span>
        <div>
          <h2>The Lab</h2>
          <div className="blurb">Every production line at a glance — keep them humming and spot the bottlenecks.</div>
        </div>
        <div className="lvtag"><b>{sum.running}</b><small>of {lines.length} running</small></div>
      </div>

      <div className="lab-summary">
        <span className="lab-chip" style={{ color: 'var(--good)' }}>▶ {sum.running} running</span>
        <span className="lab-chip" style={{ color: 'var(--danger)' }}>⚠ {sum.stalled} stalled</span>
        <span className="lab-chip" style={{ color: 'var(--gold)' }}>⏸ {sum.paused} paused</span>
        <span className="lab-chip" style={{ color: 'var(--faint)' }}>○ {sum.idle} idle</span>
        <button className="btn btn-ghost" style={{ marginLeft: 'auto' }} onClick={s.stopAllLines}>⏹ Stop all</button>
        <button className="btn" onClick={savePreset}>💾 Save preset</button>
      </div>

      {s.presets.length > 0 && (
        <div className="preset-row">
          {s.presets.map((p) => (
            <span key={p.id} className="preset-chip">
              <button className="preset-apply" onClick={() => s.applyPreset(p.id)} title="Load this setup">▶ {p.name}</button>
              <button className="preset-del" onClick={() => s.deletePreset(p.id)} title="Delete">✕</button>
            </span>
          ))}
        </div>
      )}

      <div className="section-label" style={{ marginTop: 18 }}>Lines</div>
      <div className="lines-grid">
        {lines.map((line) => {
          const def = SKILL_BY_ID[line.skill];
          const st = STATUS[line.status];
          const pct = line.effDur > 0 ? Math.min(1, (s.progress[line.skill] ?? 0) / line.effDur) : 0;
          const outQty = line.recipeId && line.primary
            ? (RECIPE_BY_ID[line.recipeId]?.outputs.find((o) => o.item === line.primary)?.qty ?? 1)
            : 1;
          const rate = line.cyclesPerMin > 0 ? `${(line.cyclesPerMin * outQty).toFixed(1)}/min` : '—';
          return (
            <button key={line.skill} className={`line-card ${line.status}`} onClick={() => onSelect(line.skill as SkillId)}>
              <div className="line-top">
                <span className="ic" style={{ background: shade(def.color) }}>{def.icon}</span>
                <span className="line-name">{def.name}</span>
                <span className="line-status" style={{ color: st.color }}>{st.label}</span>
              </div>
              <div className="line-recipe">
                {line.recipeName ? (
                  <>
                    {line.primary && <span>{getItem(line.primary).icon}</span>} {line.recipeName}
                  </>
                ) : (
                  <span style={{ color: 'var(--faint)' }}>no line set — click to start one</span>
                )}
              </div>
              {line.recipeId && <div className="bar"><span style={{ width: `${pct * 100}%`, background: st.color }} /></div>}
              <div className="line-foot">
                {line.status === 'running' && <span style={{ color: 'var(--good)' }}>{rate}</span>}
                {line.status === 'stalled' && line.missing && (
                  <span style={{ color: 'var(--danger)' }}>needs {getItem(line.missing).icon} {getItem(line.missing).name}</span>
                )}
                {line.status === 'paused' && <span style={{ color: 'var(--gold)' }}>shelf full (cap {line.cap})</span>}
                {line.cap != null && line.status !== 'paused' && <span style={{ color: 'var(--faint)', marginLeft: 'auto' }}>cap {line.cap}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="section-label" style={{ marginTop: 20 }}>Resource flow <span style={{ textTransform: 'none', color: 'var(--faint)' }}>· net per minute across running lines</span></div>
      {flows.length === 0 ? (
        <div className="empty-note">No lines are running yet. Start a few and the flows will appear here.</div>
      ) : (
        <div className="flow-grid">
          {flows.map((f) => {
            const item = getItem(f.item);
            const depleting = f.net < 0;
            return (
              <div className="flow" key={f.item} title={`+${f.produced.toFixed(1)} made, −${f.consumed.toFixed(1)} used per min`}>
                <span className="flow-ic">{item.icon}</span>
                <span className="flow-name">{item.name}</span>
                <span className="flow-net" style={{ color: depleting ? 'var(--danger)' : 'var(--good)' }}>
                  {f.net > 0 ? '+' : ''}{f.net.toFixed(1)}/min
                </span>
              </div>
            );
          })}
        </div>
      )}
      <p className="tip">A red flow means you're spending it faster than you make it — cap the downstream line, or add another upstream one.</p>
    </div>
  );
}

function shade(hex: string): string {
  return `color-mix(in srgb, ${hex} 30%, var(--panel-3))`;
}
