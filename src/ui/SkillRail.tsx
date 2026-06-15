import { useGame } from '../game/store';
import { SKILLS, RECIPE_BY_ID, CATEGORIES } from '../game/content';
import { levelProgress } from '../game/xp';

export function SkillRail({ selected, onSelect }: { selected: string; onSelect: (s: string) => void }) {
  const skillXp = useGame((s) => s.skillXp);
  const active = useGame((s) => s.activeRecipe);

  return (
    <div className="rail">
      <button
        className={`lab-btn${selected === 'lab' ? ' active' : ''}`}
        onClick={() => onSelect('lab')}
        title="See every line at a glance"
      >
        <span className="ic">🏚️</span>
        <span><b>The Lab</b><small>your whole shop at a glance</small></span>
      </button>

      {CATEGORIES.map((cl) => (
        <div key={cl.id}>
          <div className="rail-cat">
            <span className="rail-cat-label" style={{ color: cl.color }}>{cl.label}</span>
            <span className="rail-cat-blurb">{cl.blurb}</span>
          </div>
          {SKILLS.filter((sk) => sk.cluster === cl.id).map((sk) => {
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
                    <span className="running">▶ {running.name.replace(/^(Gather|Separate|Channel) /, '')}</span>
                  ) : (
                    <span className="mini"><span style={{ width: `${pct * 100}%` }} /></span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ))}

      <div className="rail-divider" />
      <div className="rail-title">Almanac</div>
      {[
        { id: 'codex', icon: '📖', name: 'Codex', color: '#c08ae0' },
        { id: 'shop', icon: '🛒', name: 'Apothecary', color: '#e7c46b' },
      ].map((nav) => (
        <button
          key={nav.id}
          className={`skill-btn${selected === nav.id ? ' active' : ''}`}
          onClick={() => onSelect(nav.id)}
        >
          <span className="ic" style={{ background: shade(nav.color) }}>{nav.icon}</span>
          <span className="meta"><span className="nm"><span>{nav.name}</span></span></span>
        </button>
      ))}
    </div>
  );
}

function shade(hex: string): string {
  return `color-mix(in srgb, ${hex} 32%, var(--panel-3))`;
}
