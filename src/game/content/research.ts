import type { SkillId } from '../types';

// Permanent upgrades bought with Insight in the Research Log. Effects are read
// by the simulation (speed/quality/yield) or gate content (recipe reveals,
// Codex hints). One-time purchases.
export interface Perk {
  id: string;
  name: string;
  icon: string;
  cost: number; // Insight
  desc: string;
  requires?: string; // another perk id
  // effects (all optional)
  insightBonus?: number; // +fraction to Study output (e.g. 0.25)
  qualityBonus?: number; // +grades to all products
  speedAll?: number; // multiplicative line speed (e.g. 1.1)
  yieldFor?: { skills: SkillId[]; amount: number }; // +flat output to gathering skills
  revealsCodex?: boolean; // show hints for undiscovered combinations
  unlocksRecipe?: string; // a perkReq this perk satisfies (handled via id match)
}

export const PERKS: Perk[] = [
  { id: 'keen_study', name: 'Keen Study', icon: '🔬', cost: 20, desc: 'Study yields +30% Insight.', insightBonus: 0.3 },
  { id: 'green_thumb', name: 'Green Theory', icon: '🌿', cost: 35, desc: 'Foraging & Gardening yield +1 herb per gather.', yieldFor: { skills: ['foraging', 'gardening'], amount: 1 } },
  { id: 'cartography', name: 'Web Cartography', icon: '🗺️', cost: 40, desc: 'The Codex reveals the recipe for combinations you have not yet found.', revealsCodex: true },
  { id: 'alchemical_insight', name: 'Alchemical Insight', icon: '✨', cost: 80, desc: '+1 quality grade to every product you craft.', qualityBonus: 1 },
  { id: 'flow_state', name: 'Flow State', icon: '🌀', cost: 120, desc: 'Every production line runs 10% faster.', speedAll: 1.1 },
  { id: 'master_distiller', name: 'Master Distiller', icon: '🫗', cost: 90, desc: 'Unlocks the Solar Distillate recipe in Distillation.', requires: 'keen_study' },
  { id: 'deeper_mysteries', name: 'Deeper Mysteries', icon: '🌌', cost: 70, desc: 'Lets you discover the most advanced compounds in the crucible.', requires: 'cartography' },
];

export const PERK_BY_ID: Record<string, Perk> = Object.fromEntries(PERKS.map((p) => [p.id, p]));
