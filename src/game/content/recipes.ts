import type { Recipe } from '../types';
import { ELEMENT_BY_ID } from './elements';
import { getItem } from './items';

// ── Gathering: no inputs, yields one ingredient per cycle ──
const gather = (
  id: string,
  skill: 'foraging' | 'gardening',
  out: string,
  levelReq: number,
  duration: number,
  xp: number,
): Recipe => ({
  id,
  name: `Gather ${getItem(out).name}`,
  skill,
  levelReq,
  duration,
  xp,
  inputs: [],
  outputs: [{ item: out, qty: 1 }],
  unlock: 'taught',
  blurb: getItem(out).blurb,
});

const GATHERING: Recipe[] = [
  gather('forage_lavender', 'foraging', 'lavender', 1, 3, 8),
  gather('forage_chamomile', 'foraging', 'chamomile', 1, 3, 8),
  gather('forage_mistleaf', 'foraging', 'mistleaf', 3, 3.5, 10),
  gather('forage_embercap', 'foraging', 'embercap', 5, 4, 13),
  gather('forage_moondrop', 'foraging', 'moondrop', 12, 5, 22),
  gather('grow_honeyclover', 'gardening', 'honeyclover', 1, 3.5, 9),
  gather('grow_ironroot', 'gardening', 'ironroot', 2, 4, 11),
  gather('grow_frostmint', 'gardening', 'frostmint', 6, 4.5, 16),
  gather('grow_sunpetal', 'gardening', 'sunpetal', 8, 5, 20),
  gather('grow_glimmerbloom', 'gardening', 'glimmerbloom', 20, 6.5, 38),
];

// ── Separation: decompose one ingredient into its element motes ──
const SEPARATION: Recipe[] = [
  'lavender', 'chamomile', 'mistleaf', 'embercap', 'moondrop',
  'honeyclover', 'ironroot', 'frostmint', 'sunpetal', 'glimmerbloom',
].map((ingId) => {
  const ing = getItem(ingId);
  const comp = ing.composition ?? {};
  const outputs = Object.entries(comp).map(([el, qty]) => ({
    item: ELEMENT_BY_ID[el].moteId,
    qty: qty as number,
  }));
  const totalMotes = outputs.reduce((s, o) => s + o.qty, 0);
  return {
    id: `separate_${ingId}`,
    name: `Separate ${ing.name}`,
    skill: 'separation',
    levelReq: Math.max(1, (ing.tier - 1) * 4),
    duration: 2.5 + ing.tier * 0.4,
    xp: totalMotes * 2.5,
    inputs: [{ item: ingId, qty: 1 }],
    outputs,
    unlock: 'taught',
    blurb: `Draw out the ${outputs.map((o) => getItem(o.item).name).join(', ')}.`,
  } satisfies Recipe;
});

// ── Conjunction: recombine motes into essences (discovered by experiment) ──
const CONJUNCTION: Recipe[] = [
  { id: 'conj_steam', name: 'Steam Essence', skill: 'conjunction', levelReq: 1, duration: 3, xp: 10, unlock: 'experiment',
    inputs: [{ item: 'mote_ignis', qty: 1 }, { item: 'mote_aqua', qty: 1 }], outputs: [{ item: 'steam_essence', qty: 1 }] },
  { id: 'conj_ember', name: 'Ember Essence', skill: 'conjunction', levelReq: 3, duration: 3.5, xp: 14, unlock: 'experiment',
    inputs: [{ item: 'mote_ignis', qty: 2 }, { item: 'mote_terra', qty: 1 }], outputs: [{ item: 'ember_essence', qty: 1 }] },
  { id: 'conj_calm', name: 'Calm Essence', skill: 'conjunction', levelReq: 5, duration: 4, xp: 20, unlock: 'experiment',
    inputs: [{ item: 'mote_aer', qty: 1 }, { item: 'mote_aqua', qty: 1 }, { item: 'mote_aether', qty: 1 }], outputs: [{ item: 'calm_essence', qty: 1 }] },
  { id: 'conj_verdant', name: 'Verdant Essence', skill: 'conjunction', levelReq: 8, duration: 4, xp: 22, unlock: 'experiment',
    inputs: [{ item: 'mote_terra', qty: 1 }, { item: 'mote_aqua', qty: 1 }, { item: 'mote_aer', qty: 1 }], outputs: [{ item: 'verdant_essence', qty: 1 }] },
  { id: 'conj_whisper', name: 'Whisper Essence', skill: 'conjunction', levelReq: 12, duration: 5, xp: 30, unlock: 'experiment',
    inputs: [{ item: 'mote_aer', qty: 2 }, { item: 'mote_aether', qty: 1 }], outputs: [{ item: 'whisper_essence', qty: 1 }] },
  { id: 'conj_lumen', name: 'Lumen Essence', skill: 'conjunction', levelReq: 20, duration: 6, xp: 50, unlock: 'experiment',
    inputs: [{ item: 'mote_aether', qty: 2 }, { item: 'mote_ignis', qty: 1 }], outputs: [{ item: 'lumen_essence', qty: 1 }] },
];

// ── Remedycraft: formulate essences into finished products ──
const REMEDYCRAFT: Recipe[] = [
  { id: 'craft_sleep_tonic', name: 'Sleep Tonic', skill: 'remedycraft', levelReq: 1, duration: 4, xp: 25, unlock: 'taught',
    inputs: [{ item: 'calm_essence', qty: 2 }], outputs: [{ item: 'sleep_tonic', qty: 1 }] },
  { id: 'craft_warming_salve', name: 'Warming Salve', skill: 'remedycraft', levelReq: 3, duration: 4.5, xp: 30, unlock: 'taught',
    inputs: [{ item: 'steam_essence', qty: 1 }, { item: 'ember_essence', qty: 1 }], outputs: [{ item: 'warming_salve', qty: 1 }] },
  { id: 'craft_morning_draught', name: 'Morning Draught', skill: 'remedycraft', levelReq: 8, duration: 5, xp: 45, unlock: 'taught',
    inputs: [{ item: 'verdant_essence', qty: 1 }, { item: 'ember_essence', qty: 1 }], outputs: [{ item: 'morning_draught', qty: 1 }] },
  { id: 'craft_clarity_elixir', name: 'Clarity Elixir', skill: 'remedycraft', levelReq: 16, duration: 6, xp: 80, unlock: 'taught',
    inputs: [{ item: 'lumen_essence', qty: 1 }, { item: 'whisper_essence', qty: 1 }], outputs: [{ item: 'clarity_elixir', qty: 1 }] },
];

export const RECIPES: Recipe[] = [...GATHERING, ...SEPARATION, ...CONJUNCTION, ...REMEDYCRAFT];

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

export const EXPERIMENT_RECIPES = CONJUNCTION;

/** Canonical signature of an input multiset, for experiment matching. */
export function inputSignature(inputs: { item: string; qty: number }[]): string {
  return inputs
    .map((i) => `${i.item}x${i.qty}`)
    .sort()
    .join('+');
}
