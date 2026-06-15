import type { ItemStack, SkillId } from '../types';

// The Magnum Opus — the cozy answer to a factory game's "launch the rocket".
// Four alchemical stages, each consuming mastery-tier goods and gating on skill,
// culminating in the Philosopher's Stone. Completing it unlocks the New Bloom.
export interface OpusStage {
  id: string;
  name: string;
  latin: string;
  blurb: string;
  inputs: ItemStack[];
  skillReq?: { skill: SkillId; level: number };
  totalLevelReq?: number;
}

export const GREAT_WORK: OpusStage[] = [
  {
    id: 'nigredo', name: 'The Blackening', latin: 'Nigredo',
    blurb: 'Reduce all things to the prima materia — burn away what is impure.',
    inputs: [{ item: 'ember_essence', qty: 6 }, { item: 'clay_essence', qty: 6 }, { item: 'iron_salt', qty: 4 }],
    skillReq: { skill: 'calcination', level: 25 },
  },
  {
    id: 'albedo', name: 'The Whitening', latin: 'Albedo',
    blurb: 'Wash the blackened matter until it gleams silver-pure.',
    inputs: [{ item: 'serene_distillate', qty: 4 }, { item: 'quintessence', qty: 3 }, { item: 'lesser_sigil', qty: 2 }],
    skillReq: { skill: 'distillation', level: 35 },
  },
  {
    id: 'citrinitas', name: 'The Yellowing', latin: 'Citrinitas',
    blurb: 'Coax the dawn-gold of the sun out of the silver.',
    inputs: [{ item: 'daystar_concentrate', qty: 3 }, { item: 'quintessence', qty: 5 }, { item: 'greater_sigil', qty: 2 }],
    skillReq: { skill: 'conjunction', level: 45 },
  },
  {
    id: 'rubedo', name: 'The Reddening', latin: 'Rubedo',
    blurb: 'Wed sun and moon at last. The Stone is born.',
    inputs: [{ item: 'panacea', qty: 1 }, { item: 'sunforge_essence', qty: 2 }, { item: 'master_sigil', qty: 1 }, { item: 'quintessence', qty: 10 }],
    totalLevelReq: 700,
  },
];

/** Each completed Bloom grants this much permanent line-speed (stacking). */
export const BLOOM_SPEED_PER = 0.08;
/** Starting coins on a new Bloom scale with how many you've done. */
export const BLOOM_START_COINS = 150;
