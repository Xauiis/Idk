import { RECIPES } from './content';
import type { Recipe, SkillId } from './types';
import { levelForXp } from './xp';
import type { GameState } from './store';

/** Recipes belonging to a skill, sorted by level requirement. */
export function recipesForSkill(skill: SkillId): Recipe[] {
  return RECIPES.filter((r) => r.skill === skill).sort((a, b) => a.levelReq - b.levelReq);
}

/** Recipes the player can currently select for a skill (level met, and discovered/researched if gated). */
export function availableRecipes(state: GameState, skill: SkillId): Recipe[] {
  const level = levelForXp(state.skillXp[skill]);
  return recipesForSkill(skill).filter((r) => {
    if (r.levelReq > level) return false;
    if (r.perkReq && !state.perks.includes(r.perkReq)) return false;
    if (r.unlock === 'experiment') return state.discovered.includes(r.id);
    return true;
  });
}

/** Recipes that should appear in a skill panel (researched/discovered, level may still gate). */
export function visibleRecipes(state: GameState, skill: SkillId): Recipe[] {
  return recipesForSkill(skill).filter((r) => {
    if (r.perkReq && !state.perks.includes(r.perkReq)) return false;
    if (r.unlock === 'experiment') return state.discovered.includes(r.id);
    return true;
  });
}

export function skillLevel(state: GameState, skill: SkillId): number {
  return levelForXp(state.skillXp[skill]);
}
