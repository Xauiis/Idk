import { useGame, questMetrics } from '../game/store';
import { QUESTS } from '../game/content';

export function QuestsPanel() {
  const s = useGame();
  const m = questMetrics(s);
  const done = (id: string) => s.questsClaimed.includes(id);
  const completed = QUESTS.filter((q) => done(q.id)).length;
  const pct = Math.round((completed / QUESTS.length) * 100);
  const activeId = QUESTS.find((q) => !done(q.id))?.id;

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 16 }}>
        <span className="ic" style={{ background: 'color-mix(in srgb, #8fc77e 30%, var(--panel-3))' }}>📋</span>
        <div>
          <h2>First Steps</h2>
          <div className="blurb">A gentle path through everything the shop can do. Tasks complete themselves as you play.</div>
        </div>
        <div className="lvtag"><b>{completed}/{QUESTS.length}</b><small>{pct}% done</small></div>
      </div>
      <div className="lvbar"><span style={{ width: `${pct}%` }} /></div>

      <div className="quest-list">
        {QUESTS.map((q) => {
          const isDone = done(q.id);
          const isActive = q.id === activeId;
          const nearly = !isDone && q.check(m); // satisfied but not yet swept up by the tick
          return (
            <div key={q.id} className={`quest${isDone ? ' done' : isActive ? ' active' : ''}`}>
              <span className="quest-ic">{isDone || nearly ? '✓' : q.icon}</span>
              <div className="quest-body">
                <div className="quest-name">{q.name}</div>
                <div className="quest-hint">{q.hint}</div>
              </div>
              <span className="quest-reward">
                {q.reward.coins ? `+${q.reward.coins}🪙` : ''} {q.reward.insight ? `+${q.reward.insight}💡` : ''}
              </span>
            </div>
          );
        })}
      </div>
      {!activeId && <div className="empty-note" style={{ marginTop: 14 }}>Every first step taken — Mirefen is lucky to have you. 🌟</div>}
    </div>
  );
}
