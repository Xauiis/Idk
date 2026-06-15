import type { ItemStack, Recipe, SkillId } from '../types';
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
  gather('forage_mistleaf', 'foraging', 'mistleaf', 3, 3.2, 10),
  gather('forage_embercap', 'foraging', 'embercap', 5, 3.6, 13),
  gather('forage_thornbud', 'foraging', 'thornbud', 9, 4, 18),
  gather('forage_moondrop', 'foraging', 'moondrop', 13, 4.6, 23),
  gather('forage_dreamcap', 'foraging', 'dreamcap', 19, 5.4, 34),
  gather('forage_glimmerbloom', 'foraging', 'glimmerbloom', 24, 6, 42),
  gather('grow_honeyclover', 'gardening', 'honeyclover', 1, 3.4, 9),
  gather('grow_ironroot', 'gardening', 'ironroot', 2, 3.8, 11),
  gather('grow_saltreed', 'gardening', 'saltreed', 6, 4, 15),
  gather('grow_frostmint', 'gardening', 'frostmint', 8, 4.4, 17),
  gather('grow_sunpetal', 'gardening', 'sunpetal', 11, 4.8, 21),
  gather('grow_dawnberry', 'gardening', 'dawnberry', 17, 5.4, 32),
  gather('grow_starthistle', 'gardening', 'starthistle', 23, 6.2, 44),
];

// ── Separation: decompose one ingredient into its element motes ──
const SEPARATION: Recipe[] = [
  'lavender', 'chamomile', 'mistleaf', 'embercap', 'thornbud', 'moondrop', 'dreamcap', 'glimmerbloom',
  'honeyclover', 'ironroot', 'saltreed', 'frostmint', 'sunpetal', 'dawnberry', 'starthistle',
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
    levelReq: Math.max(1, (ing.tier - 1) * 5),
    duration: 2.4 + ing.tier * 0.4,
    xp: totalMotes * 2.5,
    inputs: [{ item: ingId, qty: 1 }],
    outputs,
    unlock: 'taught',
    blurb: `Draw out the ${outputs.map((o) => getItem(o.item).name).join(', ')}.`,
  } satisfies Recipe;
});

// ── Glassblowing: shape motes into vessels that hold finished goods ──
const GLASSBLOWING: Recipe[] = [
  { id: 'blow_vial', name: 'Glass Vial', skill: 'glassblowing', levelReq: 1, duration: 3, xp: 9, unlock: 'taught',
    inputs: [{ item: 'mote_terra', qty: 2 }, { item: 'mote_ignis', qty: 1 }], outputs: [{ item: 'vial', qty: 1 }] },
  { id: 'blow_flask', name: 'Aether Flask', skill: 'glassblowing', levelReq: 12, duration: 4.5, xp: 30, unlock: 'taught',
    inputs: [{ item: 'mote_terra', qty: 3 }, { item: 'mote_ignis', qty: 1 }, { item: 'mote_aether', qty: 1 }], outputs: [{ item: 'flask', qty: 1 }] },
];

// ── Conjunction: the combination web (discovered by experiment) ──
const m = (el: string, qty = 1): ItemStack => ({ item: ELEMENT_BY_ID[el].moteId, qty });
const it = (id: string, qty = 1): ItemStack => ({ item: id, qty });

interface ConjDef { out: string; level: number; xp: number; dur: number; inputs: ItemStack[] }

const CONJ: ConjDef[] = [
  // pairwise dyads
  { out: 'clay_essence', level: 1, xp: 9, dur: 3, inputs: [m('terra'), m('aqua')] },
  { out: 'ember_essence', level: 1, xp: 10, dur: 3, inputs: [m('terra'), m('ignis')] },
  { out: 'steam_essence', level: 1, xp: 10, dur: 3, inputs: [m('ignis'), m('aqua')] },
  { out: 'mist_essence', level: 2, xp: 10, dur: 3, inputs: [m('aqua'), m('aer')] },
  { out: 'pollen_essence', level: 3, xp: 11, dur: 3.2, inputs: [m('terra'), m('aer')] },
  { out: 'spark_essence', level: 4, xp: 12, dur: 3.2, inputs: [m('ignis'), m('aer')] },
  { out: 'loamheart_essence', level: 6, xp: 16, dur: 3.6, inputs: [m('terra'), m('aether')] },
  { out: 'moonwater_essence', level: 7, xp: 16, dur: 3.6, inputs: [m('aqua'), m('aether')] },
  { out: 'lumen_essence', level: 8, xp: 18, dur: 3.8, inputs: [m('ignis'), m('aether')] },
  { out: 'whisper_essence', level: 9, xp: 18, dur: 3.8, inputs: [m('aer'), m('aether')] },
  // triads
  { out: 'verdant_essence', level: 5, xp: 20, dur: 4, inputs: [m('terra'), m('aqua'), m('aer')] },
  { out: 'hearth_essence', level: 6, xp: 22, dur: 4, inputs: [m('terra'), m('ignis'), m('aer')] },
  { out: 'calm_essence', level: 10, xp: 24, dur: 4.2, inputs: [m('aqua'), m('aer'), m('aether')] },
  { out: 'tideheart_essence', level: 12, xp: 28, dur: 4.4, inputs: [m('terra'), m('aqua'), m('aether')] },
  { out: 'radiance_essence', level: 13, xp: 30, dur: 4.4, inputs: [m('ignis'), m('aer'), m('aether')] },
  // rich variants
  { out: 'ignis_core', level: 7, xp: 22, dur: 4, inputs: [m('ignis', 3)] },
  { out: 'greater_whisper', level: 14, xp: 34, dur: 4.6, inputs: [m('aer', 2), m('aether', 1)] },
  { out: 'deep_moonwater', level: 15, xp: 36, dur: 4.8, inputs: [m('aqua', 2), m('aether', 1)] },
  // compounds (essence + essence)
  { out: 'geyser_tincture', level: 8, xp: 26, dur: 4.5, inputs: [it('steam_essence'), it('ember_essence')] },
  { out: 'bloomdust', level: 9, xp: 26, dur: 4.5, inputs: [it('pollen_essence'), it('mist_essence')] },
  { out: 'voltaic_essence', level: 13, xp: 34, dur: 5, inputs: [it('spark_essence'), it('steam_essence')] },
  { out: 'dewleaf_concentrate', level: 14, xp: 36, dur: 5, inputs: [it('verdant_essence'), it('mist_essence')] },
  { out: 'serenity_distillate', level: 16, xp: 42, dur: 5.4, inputs: [it('calm_essence'), it('whisper_essence')] },
  { out: 'dreamwater', level: 17, xp: 42, dur: 5.4, inputs: [it('moonwater_essence'), it('calm_essence')] },
  { out: 'thermal_loam', level: 18, xp: 48, dur: 5.8, inputs: [it('geyser_tincture'), it('clay_essence')] },
  { out: 'daystar_concentrate', level: 20, xp: 54, dur: 6, inputs: [it('lumen_essence'), it('radiance_essence')] },
  { out: 'lullaby_essence', level: 23, xp: 66, dur: 6.4, inputs: [it('serenity_distillate'), it('dreamwater')] },
  { out: 'sunforge_essence', level: 26, xp: 80, dur: 7, inputs: [it('daystar_concentrate'), it('voltaic_essence')] },
];

const CONJUNCTION: Recipe[] = CONJ.map((c) => ({
  id: `conj_${c.out}`,
  name: getItem(c.out).name,
  skill: 'conjunction',
  levelReq: c.level,
  duration: c.dur,
  xp: c.xp,
  inputs: c.inputs,
  outputs: [{ item: c.out, qty: 1 }],
  unlock: 'experiment',
}));

// ── Remedycraft: formulate essences (+ a vessel) into finished products ──
interface CraftDef { out: string; level: number; xp: number; dur: number; inputs: ItemStack[] }
const CRAFT: CraftDef[] = [
  { out: 'sleep_tonic', level: 1, xp: 22, dur: 4, inputs: [it('calm_essence'), it('vial')] },
  { out: 'warming_salve', level: 2, xp: 24, dur: 4, inputs: [it('ember_essence'), it('steam_essence'), it('vial')] },
  { out: 'dewdrop_balm', level: 4, xp: 28, dur: 4.4, inputs: [it('mist_essence'), it('clay_essence'), it('vial')] },
  { out: 'morning_draught', level: 6, xp: 38, dur: 4.8, inputs: [it('verdant_essence'), it('spark_essence'), it('vial')] },
  { out: 'bright_eye_drops', level: 8, xp: 42, dur: 5, inputs: [it('lumen_essence'), it('vial')] },
  { out: 'courage_cordial', level: 10, xp: 48, dur: 5.2, inputs: [it('hearth_essence'), it('ember_essence'), it('vial')] },
  { out: 'clarity_elixir', level: 14, xp: 70, dur: 5.6, inputs: [it('serenity_distillate'), it('flask')] },
  { out: 'dreamless_philtre', level: 17, xp: 88, dur: 6, inputs: [it('dreamwater'), it('whisper_essence'), it('flask')] },
  { out: 'sunforge_potion', level: 22, xp: 130, dur: 6.6, inputs: [it('sunforge_essence'), it('flask')] },
  { out: 'panacea', level: 26, xp: 190, dur: 7.5, inputs: [it('lullaby_essence'), it('daystar_concentrate'), it('flask')] },
];

const REMEDYCRAFT: Recipe[] = CRAFT.map((c) => ({
  id: `craft_${c.out}`,
  name: getItem(c.out).name,
  skill: 'remedycraft',
  levelReq: c.level,
  duration: c.dur,
  xp: c.xp,
  inputs: c.inputs,
  outputs: [{ item: c.out, qty: 1 }],
  unlock: 'taught',
}));

export const RECIPES: Recipe[] = [
  ...GATHERING, ...SEPARATION, ...GLASSBLOWING, ...CONJUNCTION, ...REMEDYCRAFT,
];

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

export const EXPERIMENT_RECIPES = CONJUNCTION;

/** Canonical signature of an input multiset, for experiment matching. */
export function inputSignature(inputs: ItemStack[]): string {
  return inputs.map((i) => `${i.item}x${i.qty}`).sort().join('+');
}

/** Skills that can run a production line (everything except the support skill). */
export const LINE_SKILLS: SkillId[] = [
  'foraging', 'gardening', 'separation', 'glassblowing', 'conjunction', 'remedycraft',
];
