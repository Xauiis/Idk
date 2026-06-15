import { useGame } from '../game/store';
import { recipesForSkill } from '../game/selectors';
import { levelForXp } from '../game/xp';
import { SKILL_BY_ID, getItem, speedMultipliers } from '../game/content';
import type { Recipe, SkillId } from '../game/types';
import { ItemIO } from './common';

/** Generic panel for gather / separation / remedycraft style skills. */
export function ProcessPanel({ skill }: { skill: SkillId }) {
  const xp = useGame((s) => s.skillXp[skill]);
  const active = useGame((s) => s.activeRecipe[skill]);
  const progress = useGame((s) => s.progress[skill]);
  const discovered = useGame((s) => s.discovered);
  const inventory = useGame((s) => s.inventory);
  const upgrades = useGame((s) => s.upgrades);
  const setActive = useGame((s) => s.setActive);

  const level = levelForXp(xp);
  const def = SKILL_BY_ID[skill];
  const recipes = recipesForSkill(skill);
  const speed = speedMultipliers(upgrades)[skill] ?? 1;

  const canShow = (r: Recipe) => r.unlock !== 'experiment' || discovered.includes(r.id);
  const visible = recipes.filter(canShow);

  return (
    <div className="recipe-grid">
      {visible.map((r) => {
        const locked = r.levelReq > level;
        const isActive = active === r.id;
        const effDur = r.duration / speed;
        const pct = isActive ? Math.min(1, (progress ?? 0) / effDur) : 0;
        const missing = r.inputs.find((i) => (inventory[i.item] ?? 0) < i.qty);
        return (
          <div key={r.id} className={`recipe${locked ? ' locked' : ''}${isActive ? ' active' : ''}`}>
            <div className="top">
              <span className="ic">{def.icon}</span>
              <span className="nm">{r.name.replace(/^(Gather|Separate) /, '')}</span>
              <span className="dur">{effDur.toFixed(1)}s</span>
            </div>
            <ItemIO inputs={r.inputs} outputs={r.outputs} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="xp">+{r.xp} xp</span>
              {locked && <span className="req">needs Lv {r.levelReq}</span>}
              {!locked && isActive && missing && <span className="req">out of {getItem(missing.item).name}</span>}
            </div>
            {isActive && (
              <div className="bar"><span style={{ width: `${pct * 100}%` }} /></div>
            )}
            {!locked && (
              <button
                className={`sel${isActive ? ' stop' : ''}`}
                onClick={() => setActive(skill, isActive ? null : r.id)}
              >
                {isActive ? '⏸ Stop' : '▶ Begin'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
