import type { SkillDef, SkillId } from '../types';

export const SKILLS: SkillDef[] = [
  { id: 'foraging', name: 'Foraging', cluster: 'gather', icon: '🧺', color: '#86c07c', blurb: 'Gather wild herbs, flowers and mushrooms.' },
  { id: 'gardening', name: 'Gardening', cluster: 'gather', icon: '🌱', color: '#7fb069', blurb: 'Grow your own reagents in tidy plots.' },
  { id: 'separation', name: 'Separation', cluster: 'process', icon: '⚗️', color: '#4f9dd1', blurb: 'Decompose ingredients into pure element motes.' },
  { id: 'conjunction', name: 'Conjunction', cluster: 'process', icon: '🔮', color: '#c08ae0', blurb: 'Combine elements through the discovery web.' },
  { id: 'remedycraft', name: 'Remedycraft', cluster: 'product', icon: '🧪', color: '#d9663f', blurb: 'Formulate essences into finished remedies.' },
  { id: 'hospitality', name: 'Hospitality', cluster: 'support', icon: '🫖', color: '#e0a05a', blurb: 'Read your customers and keep the shop warm.' },
];

export const SKILL_BY_ID: Record<SkillId, SkillDef> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
) as Record<SkillId, SkillDef>;
