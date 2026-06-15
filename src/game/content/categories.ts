import type { SkillCluster } from '../types';

// Skill categories — each names the general premise so newcomers to this
// (admittedly niche) game can read the loop at a glance:
//   Gather → Refine → Conjure → Craft → Shop.
export interface CategoryDef {
  id: SkillCluster;
  label: string;
  blurb: string;
  color: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'gather', label: 'Gather', color: '#86c07c', blurb: 'Coax raw herbs, minerals & Aether out of the world.' },
  { id: 'process', label: 'Refine', color: '#5aa9dd', blurb: 'Break ingredients down and purify them into usable stock.' },
  { id: 'conjure', label: 'Conjure', color: '#c08ae0', blurb: 'Recombine elements and inscribe arcane works.' },
  { id: 'craft', label: 'Craft', color: '#d9663f', blurb: 'Bottle finished remedies, feelings & treasures to sell.' },
  { id: 'support', label: 'Shop', color: '#e0a05a', blurb: 'Study your craft and serve the townsfolk of Mirefen.' },
];
