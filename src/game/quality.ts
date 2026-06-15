// Deterministic product-quality tiers. A produced product's grade is decided
// at craft time by the crafting skill's level (vs the recipe requirement) plus
// flat bonuses from tools and research — never RNG. Only `product`-kind items
// carry quality; motes, essences, materials and tools are quality-less.

export interface QualityTier {
  grade: number;
  name: string;
  short: string;
  color: string;
  valueMult: number; // sell-value / reward multiplier
}

export const QUALITIES: QualityTier[] = [
  { grade: 0, name: 'Crude', short: 'C', color: '#9a8f6f', valueMult: 0.8 },
  { grade: 1, name: 'Fine', short: 'F', color: '#8fc77e', valueMult: 1.0 },
  { grade: 2, name: 'Pure', short: 'P', color: '#5aa9dd', valueMult: 1.35 },
  { grade: 3, name: 'Pristine', short: '★', color: '#e7c46b', valueMult: 1.8 },
];

export const MAX_GRADE = 3;

export function quality(grade: number): QualityTier {
  return QUALITIES[Math.max(0, Math.min(MAX_GRADE, grade))];
}

/** Base grade from how far the crafter has out-levelled the recipe, plus bonuses. */
export function gradeFor(skillLevel: number, levelReq: number, bonus = 0): number {
  const diff = skillLevel - levelReq;
  const base = diff >= 30 ? 3 : diff >= 15 ? 2 : diff >= 5 ? 1 : 0;
  return Math.max(0, Math.min(MAX_GRADE, base + bonus));
}

// ── quality-keyed inventory helpers ──
// Products are stored under composite keys `id#grade`; everything else is flat.

export function pkey(id: string, grade: number): string {
  return `${id}#${grade}`;
}

export function baseId(key: string): string {
  const i = key.indexOf('#');
  return i === -1 ? key : key.slice(0, i);
}

export function keyGrade(key: string): number {
  const i = key.indexOf('#');
  return i === -1 ? -1 : Number(key.slice(i + 1));
}
