import type { SkillDef, SkillId } from '../types';

export const SKILLS: SkillDef[] = [
  { id: 'foraging', name: 'Foraging', cluster: 'gather', icon: '🧺', color: '#86c07c', blurb: 'Gather wild herbs, flowers and mushrooms.' },
  { id: 'gardening', name: 'Gardening', cluster: 'gather', icon: '🌱', color: '#7fb069', blurb: 'Grow your own reagents in tidy plots.' },
  { id: 'aethercraft', name: 'Aethercraft', cluster: 'gather', icon: '✦', color: '#c08ae0', blurb: 'Channel raw Aether from the ley-blooms.' },
  { id: 'separation', name: 'Separation', cluster: 'process', icon: '⚗️', color: '#4f9dd1', blurb: 'Decompose ingredients into pure element motes.' },
  { id: 'glassblowing', name: 'Glassblowing', cluster: 'process', icon: '🥃', color: '#6fb6c9', blurb: 'Shape sand and fire into vials to hold your wares.' },
  { id: 'calcination', name: 'Calcination', cluster: 'process', icon: '🧂', color: '#c98f6f', blurb: 'Burn ingredients to salts and ash for the Materials craft.' },
  { id: 'conjunction', name: 'Conjunction', cluster: 'conjure', icon: '🔮', color: '#c08ae0', blurb: 'Combine elements through the discovery web.' },
  { id: 'distillation', name: 'Distillation', cluster: 'process', icon: '🫗', color: '#79c7d9', blurb: 'Purify essences into potent distillates.' },
  { id: 'transmutation', name: 'Transmutation', cluster: 'craft', icon: '⚒️', color: '#d6a85a', blurb: 'Forge salts and essences into materials, tools and treasures.' },
  { id: 'inscription', name: 'Inscription', cluster: 'conjure', icon: '🪶', color: '#b08fd0', blurb: 'Etch sigils — and program your lines to brew just enough.' },
  { id: 'remedycraft', name: 'Remedycraft', cluster: 'craft', icon: '🧪', color: '#d9663f', blurb: 'Formulate essences into finished remedies.' },
  { id: 'feltcraft', name: 'Feltcraft', cluster: 'craft', icon: '🫧', color: '#d68fc4', blurb: 'Distill and bottle emotions for the townsfolk who need them.' },
  { id: 'lore', name: 'Lore', cluster: 'support', icon: '📚', color: '#b98fd6', blurb: 'Study your craft to earn Insight and unlock research.' },
  { id: 'hospitality', name: 'Hospitality', cluster: 'support', icon: '🫖', color: '#e0a05a', blurb: 'Read your customers and keep the shop warm.' },
];

export const SKILL_BY_ID: Record<SkillId, SkillDef> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
) as Record<SkillId, SkillDef>;
