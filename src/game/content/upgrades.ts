import type { SkillId } from '../types';
import { LINE_SKILLS } from './recipes';

export interface Upgrade {
  id: string;
  name: string;
  icon: string;
  cost: number;
  effectText: string;
  /** Multiplicative speed bonus per skill (e.g. 1.2 = +20% faster). 'all' applies to every line. */
  speed: Partial<Record<SkillId | 'all', number>>;
}

export const UPGRADES: Upgrade[] = [
  { id: 'whittled_basket', name: 'Whittled Basket', icon: '🧺', cost: 60, effectText: 'Foraging +20% faster.', speed: { foraging: 1.2 } },
  { id: 'watering_can', name: 'Copper Watering Can', icon: '🪴', cost: 60, effectText: 'Gardening +20% faster.', speed: { gardening: 1.2 } },
  { id: 'brass_mortar', name: 'Brass Mortar', icon: '⚱️', cost: 130, effectText: 'Separation +25% faster.', speed: { separation: 1.25 } },
  { id: 'glass_bellows', name: 'Glass Bellows', icon: '🎐', cost: 150, effectText: 'Glassblowing +25% faster.', speed: { glassblowing: 1.25 } },
  { id: 'wide_crucible', name: 'Wide Crucible', icon: '🍯', cost: 220, effectText: 'Conjunction +25% faster.', speed: { conjunction: 1.25 } },
  { id: 'second_burner', name: 'Second Burner', icon: '🔥', cost: 320, effectText: 'Remedycraft +25% faster.', speed: { remedycraft: 1.25 } },
  { id: 'cozy_hearth', name: 'Cozy Hearth', icon: '🏡', cost: 600, effectText: 'Every line +12% faster.', speed: { all: 1.12 } },
  { id: 'apprentice', name: "An Apprentice's Help", icon: '🧑‍🔬', cost: 1200, effectText: 'Every line +18% faster.', speed: { all: 1.18 } },
];

export const UPGRADE_BY_ID: Record<string, Upgrade> = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));

/** Resolve owned upgrade ids into a per-skill speed multiplier map. */
export function speedMultipliers(owned: string[]): Record<SkillId, number> {
  const mult: Record<SkillId, number> = {
    foraging: 1, gardening: 1, separation: 1, glassblowing: 1,
    conjunction: 1, remedycraft: 1, hospitality: 1,
  };
  for (const id of owned) {
    const up = UPGRADE_BY_ID[id];
    if (!up) continue;
    for (const [skill, factor] of Object.entries(up.speed)) {
      if (skill === 'all') {
        for (const s of LINE_SKILLS) mult[s] *= factor as number;
      } else {
        mult[skill as SkillId] *= factor as number;
      }
    }
  }
  return mult;
}
