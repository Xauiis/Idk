import type { SkillId } from '../types';

// A gentle guided path through the core loop, so a newcomer to this (deep,
// unusual) game always has an obvious next thing to try. Quests auto-complete
// when their condition is met and pay a small reward.
export interface QuestMetrics {
  did: Record<SkillId, boolean>; // has this skill ever been used (xp > 0)
  discovered: number;
  ordersFilled: number;
  biomes: number;
  perks: number;
  totalLevel: number;
  greatWork: number;
}

export interface Quest {
  id: string;
  name: string;
  hint: string;
  icon: string;
  reward: { coins?: number; insight?: number };
  check: (m: QuestMetrics) => boolean;
}

export const QUESTS: Quest[] = [
  { id: 'forage', name: 'Into the hedgerows', icon: '🧺', hint: 'Open Foraging and Begin gathering an ingredient.', reward: { coins: 10 }, check: (m) => m.did.foraging },
  { id: 'separate', name: 'The first separation', icon: '⚗️', hint: 'Use Separation to break an ingredient into element motes.', reward: { coins: 15 }, check: (m) => m.did.separation },
  { id: 'discover', name: 'A spark of discovery', icon: '🔮', hint: 'In Conjunction, drop motes into the crucible and Combine to discover an essence.', reward: { insight: 5 }, check: (m) => m.discovered >= 1 },
  { id: 'glass', name: 'A vessel to fill', icon: '🥃', hint: 'Blow a Glass Vial from Terra + Ignis motes.', reward: { coins: 20 }, check: (m) => m.did.glassblowing },
  { id: 'remedy', name: 'Your first remedy', icon: '🧪', hint: 'Craft a finished product in Remedycraft.', reward: { coins: 30 }, check: (m) => m.did.remedycraft },
  { id: 'serve', name: 'A satisfied customer', icon: '🫖', hint: 'Fulfil an order in Hospitality.', reward: { coins: 40 }, check: (m) => m.ordersFilled >= 1 },
  { id: 'aether', name: 'Touch the ley-lines', icon: '✦', hint: 'Channel raw Aether in Aethercraft.', reward: { coins: 30 }, check: (m) => m.did.aethercraft },
  { id: 'study', name: 'A studious mind', icon: '💡', hint: 'Study in Lore, then research a perk in the Research Log.', reward: { coins: 50 }, check: (m) => m.perks >= 1 },
  { id: 'travel', name: 'Beyond the Commons', icon: '🗺️', hint: 'Chart a new biome on the World Map.', reward: { insight: 10 }, check: (m) => m.biomes >= 2 },
  { id: 'feeling', name: 'Bottled emotion', icon: '🫧', hint: 'Bottle a feeling in Feltcraft.', reward: { coins: 80 }, check: (m) => m.did.feltcraft },
  { id: 'cozy', name: 'Make it home', icon: '🎀', hint: 'Craft a piece of decor in Curation to raise Coziness.', reward: { coins: 100 }, check: (m) => m.did.curation },
  { id: 'adept', name: 'A growing reputation', icon: '🌟', hint: 'Reach 100 total skill levels.', reward: { insight: 25 }, check: (m) => m.totalLevel >= 100 },
  { id: 'opus', name: 'The Great Work begins', icon: '🜚', hint: 'Complete the first stage of the Great Work.', reward: { coins: 500 }, check: (m) => m.greatWork >= 1 },
];
