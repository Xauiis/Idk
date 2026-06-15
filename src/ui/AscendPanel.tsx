import { useGame } from '../game/store';
import { GREAT_WORK, BLOOM_SPEED_PER, SKILL_BY_ID, getItem } from '../game/content';
import { levelForXp } from '../game/xp';
import type { SkillId } from '../game/types';

export function AscendPanel() {
  const s = useGame();
  const totalLevel = (Object.keys(s.skillXp) as SkillId[]).reduce((sum, k) => sum + levelForXp(s.skillXp[k]), 0);
  const heldOf = (id: string) => {
    let n = s.inventory[id] ?? 0;
    for (const k in s.inventory) if (k.startsWith(`${id}#`)) n += s.inventory[k];
    return n;
  };

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 16 }}>
        <span className="ic" style={{ background: 'color-mix(in srgb, #f0a84a 30%, var(--panel-3))' }}>🜚</span>
        <div>
          <h2>The Great Work</h2>
          <div className="blurb">Master your craft to synthesise the Philosopher's Stone — the Magnum Opus.</div>
        </div>
        <div className="lvtag"><b>{Math.min(s.greatWork, GREAT_WORK.length)}/{GREAT_WORK.length}</b><small>stages</small></div>
      </div>

      {s.blooms > 0 && (
        <div className="bloom-banner">🌸 You have bloomed <b>{s.blooms}</b> time{s.blooms > 1 ? 's' : ''} — legacy bonus <b>+{Math.round(BLOOM_SPEED_PER * s.blooms * 100)}%</b> to every line.</div>
      )}

      <div className="recipe-grid" style={{ marginTop: 6 }}>
        {GREAT_WORK.map((stage, i) => {
          const done = i < s.greatWork;
          const current = i === s.greatWork && !s.opusComplete;
          const affordItems = stage.inputs.every((inp) => heldOf(inp.item) >= inp.qty);
          const skillOk = !stage.skillReq || levelForXp(s.skillXp[stage.skillReq.skill]) >= stage.skillReq.level;
          const totalOk = !stage.totalLevelReq || totalLevel >= stage.totalLevelReq;
          const ready = current && affordItems && skillOk && totalOk;
          return (
            <div key={stage.id} className={`recipe${done ? ' active' : current ? '' : ' locked'}`} style={{ gap: 8 }}>
              <div className="top">
                <span className="ic">{done ? '✓' : current ? '🜚' : '🔒'}</span>
                <span className="nm">{stage.latin}</span>
                <span className="dur">{stage.name}</span>
              </div>
              <div className="story" style={{ fontStyle: 'italic' }}>{stage.blurb}</div>
              <div className="io">
                {stage.inputs.map((inp) => {
                  const it = getItem(inp.item);
                  const ok = heldOf(inp.item) >= inp.qty;
                  return (
                    <span key={inp.item} className="chip" style={{ borderColor: ok ? 'var(--good)' : 'var(--border-soft)' }}>
                      <span>{it.icon}</span><span>{it.name}</span><span className="q">{heldOf(inp.item)}/{inp.qty}</span>
                    </span>
                  );
                })}
              </div>
              <div className="xp" style={{ color: skillOk && totalOk ? 'var(--good)' : 'var(--danger)' }}>
                {stage.skillReq && `Requires ${SKILL_BY_ID[stage.skillReq.skill].name} ${stage.skillReq.level}`}
                {stage.totalLevelReq && `Requires ${stage.totalLevelReq} total level (you: ${totalLevel})`}
              </div>
              {current && (
                <button className="sel" disabled={!ready} style={!ready ? { opacity: 0.5 } : undefined} onClick={() => s.advanceGreatWork()}>
                  ✦ Attempt the {stage.latin}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {s.opusComplete && (
        <div className="opus-done">
          <div style={{ fontSize: 46 }}>🜚</div>
          <h2 style={{ margin: '4px 0' }}>The Great Work is complete.</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 460, margin: '0 auto 16px' }}>
            The Philosopher's Stone is warm in your hands. You could rest here, master of Mirefen… or pass the shop
            to an apprentice and begin again in a new town, carrying your wisdom with you.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => { if (confirm('Begin a New Bloom? This starts a fresh shop — you keep only a permanent legacy speed bonus and some starting coins.')) s.bloom(); }}
          >
            🌸 Begin a New Bloom (+{Math.round(BLOOM_SPEED_PER * (s.blooms + 1) * 100)}% legacy)
          </button>
        </div>
      )}
    </div>
  );
}
