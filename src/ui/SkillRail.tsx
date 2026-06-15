import { useGame } from '../game/store';
import { SKILLS, RECIPE_BY_ID } from '../game/content';
import { levelProgress } from '../game/xp';
import type { SkillId } from '../game/types';

export function SkillRail({ selected, onSelect }: { selected: SkillId; onSelect: (s: SkillId) => void }) {
  const skillXp = useGame((s) => s.skillXp);
  const active = useGame((s) => s.activeRecipe);

  return (
    <div className="rail">
      <div className="rail-title">Skills</div>
      {SKILLS.map((sk) => {
        const { level, pct } = levelProgress(skillXp[sk.id]);
        const runningId = active[sk.id];
        const running = runningId ? RECIPE_BY_ID[runningId] : null;
        return (
          <button
            key={sk.id}
            className={`skill-btn${selected === sk.id ? ' active' : ''}`}
            onClick={() => onSelect(sk.id)}
          >
            <span className="ic" style={{ background: shade(sk.color) }}>{sk.icon}</span>
            <span className="meta">
              <span className="nm"><span>{sk.name}</span><span className="lv">{level}</span></span>
              {running ? (
                <span className="running">▶ {running.name.replace(/^(Gather|Separate) /, '')}</span>
              ) : (
                <span className="mini"><span style={{ width: `${pct * 100}%` }} /></span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function shade(hex: string): string {
  return `color-mix(in srgb, ${hex} 32%, var(--panel-3))`;
}
