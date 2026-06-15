import type { ItemStack, Recipe, SkillId } from '../types';
import { ELEMENT_BY_ID } from './elements';
import { getItem } from './items';

// ── Gathering: no inputs, yields one ingredient per cycle ──
const gather = (
  id: string,
  skill: 'foraging' | 'gardening' | 'prospecting' | 'tidewalking',
  out: string,
  levelReq: number,
  duration: number,
  xp: number,
  biome: string,
  seasons?: number[],
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
  biome,
  seasons,
  blurb: getItem(out).blurb,
});

const GATHERING: Recipe[] = [
  // Mirefen Commons (free)
  gather('forage_lavender', 'foraging', 'lavender', 1, 3, 8, 'commons'),
  gather('forage_chamomile', 'foraging', 'chamomile', 1, 3, 8, 'commons'),
  gather('forage_mistleaf', 'foraging', 'mistleaf', 3, 3.2, 10, 'commons'),
  gather('grow_honeyclover', 'gardening', 'honeyclover', 1, 3.4, 9, 'commons'),
  gather('grow_ironroot', 'gardening', 'ironroot', 2, 3.8, 11, 'commons'),
  // Sunpetal Meadows (gardening expansion; some crops are seasonal)
  gather('grow_saltreed', 'gardening', 'saltreed', 6, 4, 15, 'meadows'),
  gather('grow_frostmint', 'gardening', 'frostmint', 8, 4.4, 17, 'meadows', [3]),
  gather('grow_sunpetal', 'gardening', 'sunpetal', 11, 4.8, 21, 'meadows', [0, 1]),
  gather('grow_dawnberry', 'gardening', 'dawnberry', 17, 5.4, 32, 'meadows', [1]),
  // Emberpeak Slopes (fiery foraging)
  gather('forage_embercap', 'foraging', 'embercap', 5, 3.6, 13, 'emberpeak'),
  gather('forage_thornbud', 'foraging', 'thornbud', 9, 4, 18, 'emberpeak'),
  // Moonlit Grove (Aether-rich, much of it seasonal/nocturnal)
  gather('forage_moondrop', 'foraging', 'moondrop', 13, 4.6, 23, 'grove', [2, 3]),
  gather('forage_dreamcap', 'foraging', 'dreamcap', 19, 5.4, 34, 'grove'),
  gather('forage_glimmerbloom', 'foraging', 'glimmerbloom', 24, 6, 42, 'grove'),
  gather('grow_starthistle', 'gardening', 'starthistle', 23, 6.2, 44, 'grove'),
  // Whispering Caves (Prospecting)
  gather('mine_quartz', 'prospecting', 'quartz', 1, 3.2, 9, 'caves'),
  gather('mine_salt_crystal', 'prospecting', 'salt_crystal', 4, 3.8, 14, 'caves'),
  gather('mine_emberstone', 'prospecting', 'emberstone', 7, 4.2, 18, 'caves'),
  gather('mine_voidshard', 'prospecting', 'voidshard', 18, 5.8, 38, 'caves'),
  // Saltmarsh Coast (Tidewalking)
  gather('tide_kelp', 'tidewalking', 'kelp', 1, 3.2, 9, 'coast'),
  gather('tide_tidewort', 'tidewalking', 'tidewort', 5, 4, 16, 'coast'),
  gather('tide_brinepearl', 'tidewalking', 'brinepearl', 14, 5.2, 30, 'coast'),
];

// ── Separation: decompose one ingredient into its element motes ──
const SEPARATION: Recipe[] = [
  'lavender', 'chamomile', 'mistleaf', 'embercap', 'thornbud', 'moondrop', 'dreamcap', 'glimmerbloom',
  'honeyclover', 'ironroot', 'saltreed', 'frostmint', 'sunpetal', 'dawnberry', 'starthistle',
  'quartz', 'salt_crystal', 'emberstone', 'voidshard', 'kelp', 'tidewort', 'brinepearl',
  'honey', 'cinder_egg',
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
    inputs: [{ item: 'mote_terra', qty: 2 }, { item: 'mote_ignis', qty: 1 }], outputs: [{ item: 'vial', qty: 2 }] },
  { id: 'blow_flask', name: 'Aether Flask', skill: 'glassblowing', levelReq: 12, duration: 4.5, xp: 30, unlock: 'taught',
    inputs: [{ item: 'mote_terra', qty: 3 }, { item: 'mote_ignis', qty: 1 }, { item: 'mote_aether', qty: 1 }], outputs: [{ item: 'flask', qty: 1 }] },
];

// ── Conjunction: the combination web (discovered by experiment) ──
const m = (el: string, qty = 1): ItemStack => ({ item: ELEMENT_BY_ID[el].moteId, qty });
const it = (id: string, qty = 1): ItemStack => ({ item: id, qty });

interface ConjDef { out: string; level: number; xp: number; dur: number; inputs: ItemStack[]; perkReq?: string }

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
  { out: 'thermal_loam', level: 18, xp: 48, dur: 5.8, inputs: [it('geyser_tincture'), it('clay_essence')], perkReq: 'deeper_mysteries' },
  { out: 'daystar_concentrate', level: 20, xp: 54, dur: 6, inputs: [it('lumen_essence'), it('radiance_essence')], perkReq: 'deeper_mysteries' },
  { out: 'lullaby_essence', level: 23, xp: 66, dur: 6.4, inputs: [it('serenity_distillate'), it('dreamwater')], perkReq: 'deeper_mysteries' },
  { out: 'sunforge_essence', level: 26, xp: 80, dur: 7, inputs: [it('daystar_concentrate'), it('voltaic_essence')], perkReq: 'deeper_mysteries' },
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
  perkReq: c.perkReq,
}));

// ── Remedycraft: formulate essences (+ a vessel) into finished products ──
interface CraftDef { out: string; level: number; xp: number; dur: number; inputs: ItemStack[] }
const CRAFT: CraftDef[] = [
  { out: 'sleep_tonic', level: 1, xp: 22, dur: 4, inputs: [it('calm_essence'), it('vial')] },
  { out: 'warming_salve', level: 2, xp: 24, dur: 4, inputs: [it('ember_essence'), it('steam_essence'), it('vial')] },
  { out: 'dewdrop_balm', level: 4, xp: 28, dur: 4.4, inputs: [it('mist_essence'), it('clay_essence'), it('vial')] },
  { out: 'morning_draught', level: 6, xp: 38, dur: 4.8, inputs: [it('verdant_essence'), it('spark_essence'), it('vial')] },
  { out: 'bright_eye_drops', level: 8, xp: 42, dur: 5, inputs: [it('lumen_essence'), it('vial')] },
  { out: 'clarity_elixir', level: 14, xp: 70, dur: 5.6, inputs: [it('serenity_distillate'), it('flask')] },
  { out: 'sunforge_potion', level: 22, xp: 130, dur: 6.6, inputs: [it('sunforge_essence'), it('flask')] },
  { out: 'dawnlight_tonic', level: 20, xp: 132, dur: 6.5, inputs: [it('radiant_distillate'), it('flask')] },
  { out: 'panacea', level: 26, xp: 190, dur: 7.5, inputs: [it('lullaby_essence'), it('daystar_concentrate'), it('flask')] },
];

// ── Aethercraft: channel raw Aether, and refine it into Quintessence ──
const AETHERCRAFT: Recipe[] = [
  { id: 'channel_ley', name: 'Channel Ley-Bloom', skill: 'aethercraft', levelReq: 1, duration: 5, xp: 14, unlock: 'taught',
    inputs: [], outputs: [m('aether', 1)], blurb: 'Coax a single mote of Aether from the bloom.' },
  { id: 'channel_bright', name: 'Channel Bright Bloom', skill: 'aethercraft', levelReq: 8, duration: 5.5, xp: 26, unlock: 'taught',
    inputs: [], outputs: [m('aether', 2)], blurb: 'A brighter bloom gives up more.' },
  { id: 'channel_radiant', name: 'Channel Radiant Bloom', skill: 'aethercraft', levelReq: 16, duration: 6, xp: 42, unlock: 'taught',
    inputs: [], outputs: [m('aether', 3)], blurb: 'The air shivers as you draw it in.' },
  { id: 'refine_quintessence', name: 'Refine Quintessence', skill: 'aethercraft', levelReq: 6, duration: 6, xp: 30, unlock: 'taught',
    inputs: [m('aether', 5)], outputs: [it('quintessence')], blurb: 'Condense raw Aether into the fifth element.' },
];

// ── Inscription: etch sigils (arcane feedstock for enchanted goods) ──
const INSCRIPTION: Recipe[] = [
  { id: 'inscribe_lesser', name: 'Lesser Sigil', skill: 'inscription', levelReq: 1, duration: 4.5, xp: 18, unlock: 'taught',
    inputs: [it('white_salt'), m('aether', 2)], outputs: [it('lesser_sigil')] },
  { id: 'inscribe_greater', name: 'Greater Sigil', skill: 'inscription', levelReq: 10, duration: 5.5, xp: 40, unlock: 'taught',
    inputs: [it('living_brass'), it('quintessence')], outputs: [it('greater_sigil')] },
  { id: 'inscribe_master', name: 'Master Sigil', skill: 'inscription', levelReq: 20, duration: 7, xp: 90, unlock: 'taught',
    inputs: [it('aether_alloy'), it('quintessence', 2)], outputs: [it('master_sigil')] },
];

// ── Feltcraft: bottle emotions (the Feelings tree — every recipe needs Aether) ──
const FELTCRAFT: Recipe[] = [
  { id: 'felt_calm', name: 'Bottled Calm', skill: 'feltcraft', levelReq: 1, duration: 4.5, xp: 26, unlock: 'taught',
    inputs: [it('calm_essence'), m('aether', 2), it('vial')], outputs: [it('feeling_calm')] },
  { id: 'felt_courage', name: 'Bottled Courage', skill: 'feltcraft', levelReq: 4, duration: 5, xp: 34, unlock: 'taught',
    inputs: [it('hearth_essence'), m('aether', 2), it('vial')], outputs: [it('feeling_courage')] },
  { id: 'felt_focus', name: 'Bottled Focus', skill: 'feltcraft', levelReq: 8, duration: 5.2, xp: 46, unlock: 'taught',
    inputs: [it('whisper_essence'), m('aether', 2), it('vial')], outputs: [it('feeling_focus')] },
  { id: 'craft_courage_cordial', name: 'Courage Cordial', skill: 'feltcraft', levelReq: 10, duration: 5.2, xp: 48, unlock: 'taught',
    inputs: [it('hearth_essence'), it('ember_essence'), m('aether'), it('vial')], outputs: [it('courage_cordial')] },
  { id: 'felt_wonder', name: 'Bottled Wonder', skill: 'feltcraft', levelReq: 12, duration: 5.6, xp: 70, unlock: 'taught',
    inputs: [it('lumen_essence'), it('quintessence'), it('flask')], outputs: [it('feeling_wonder')] },
  { id: 'felt_nostalgia', name: 'Bottled Nostalgia', skill: 'feltcraft', levelReq: 15, duration: 6, xp: 86, unlock: 'taught',
    inputs: [it('moonwater_essence'), it('dreamwater'), it('quintessence'), it('flask')], outputs: [it('feeling_nostalgia')] },
  { id: 'craft_tranquil_balm', name: 'Tranquil Balm', skill: 'feltcraft', levelReq: 16, duration: 6, xp: 92, unlock: 'taught',
    inputs: [it('serene_distillate'), m('aether', 2), it('flask')], outputs: [it('tranquil_balm')] },
  { id: 'craft_dreamless_philtre', name: 'Dreamless Philtre', skill: 'feltcraft', levelReq: 17, duration: 6, xp: 96, unlock: 'taught',
    inputs: [it('dreamwater'), it('whisper_essence'), m('aether', 2), it('flask')], outputs: [it('dreamless_philtre')] },
  { id: 'felt_serenity', name: 'Bottled Serenity', skill: 'feltcraft', levelReq: 18, duration: 6.5, xp: 120, unlock: 'taught',
    inputs: [it('serene_distillate'), it('quintessence'), it('lesser_sigil'), it('flask')], outputs: [it('feeling_serenity')] },
  { id: 'felt_euphoria', name: 'Bottled Euphoria', skill: 'feltcraft', levelReq: 24, duration: 7.5, xp: 190, unlock: 'taught',
    inputs: [it('lullaby_essence'), it('quintessence'), it('greater_sigil'), it('flask')], outputs: [it('feeling_euphoria')] },
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

// ── Lore: study a sample to earn Insight ──
const study = (id: string, ing: string, insight: number, level: number, dur: number, xp: number): Recipe => ({
  id, name: `Study ${getItem(ing).name}`, skill: 'lore', levelReq: level, duration: dur, xp,
  inputs: [it(ing)], outputs: [it('insight', insight)], unlock: 'taught',
  blurb: `Take notes on ${getItem(ing).name} for a spark of Insight.`,
});
const LORE: Recipe[] = [
  study('study_garden', 'honeyclover', 2, 1, 4, 10),
  study('study_wild', 'mistleaf', 2, 1, 4, 10),
  study('study_fungus', 'embercap', 3, 4, 4.5, 16),
  study('study_lunar', 'moondrop', 4, 9, 5, 24),
  study('study_astral', 'starthistle', 6, 16, 6, 40),
];

// ── Calcination: burn an ingredient down to salts / ash ──
const calcine = (id: string, ing: string, out: string, qty: number, level: number, dur: number, xp: number): Recipe => ({
  id, name: `Calcine ${getItem(ing).name}`, skill: 'calcination', levelReq: level, duration: dur, xp,
  inputs: [it(ing)], outputs: [it(out, qty)], unlock: 'taught',
  blurb: `Reduce ${getItem(ing).name} to ${getItem(out).name}.`,
});
const CALCINATION: Recipe[] = [
  calcine('calcine_ironroot', 'ironroot', 'iron_salt', 2, 1, 3, 9),
  calcine('calcine_embercap', 'embercap', 'ember_ash', 2, 3, 3.2, 12),
  calcine('calcine_saltreed', 'saltreed', 'white_salt', 3, 5, 3.6, 16),
  calcine('calcine_glimmerbloom', 'glimmerbloom', 'lumen_ash', 2, 12, 4.4, 28),
  calcine('calcine_starthistle', 'starthistle', 'astral_salt', 2, 18, 5, 40),
];

// ── Distillation: purify essences into potent distillates ──
const DISTILLATION: Recipe[] = [
  { id: 'distill_serene', name: 'Serene Distillate', skill: 'distillation', levelReq: 1, duration: 4.5, xp: 22, unlock: 'taught',
    inputs: [it('calm_essence', 2)], outputs: [it('serene_distillate')] },
  { id: 'distill_radiant', name: 'Radiant Distillate', skill: 'distillation', levelReq: 10, duration: 5, xp: 30, unlock: 'taught',
    inputs: [it('lumen_essence', 2)], outputs: [it('radiant_distillate')] },
  { id: 'distill_deepdream', name: 'Deepdream Distillate', skill: 'distillation', levelReq: 16, duration: 5.6, xp: 46, unlock: 'taught',
    inputs: [it('dreamwater', 2)], outputs: [it('deepdream_distillate')] },
  { id: 'distill_solar', name: 'Solar Distillate', skill: 'distillation', levelReq: 24, duration: 6.5, xp: 70, unlock: 'taught', perkReq: 'master_distiller',
    inputs: [it('sunforge_essence', 2)], outputs: [it('solar_distillate')] },
];

// ── Transmutation: materials, tools and luxury goods (the Materials tree) ──
const TRANSMUTATION: Recipe[] = [
  // materials (feedstock)
  { id: 'trans_living_brass', name: 'Living Brass', skill: 'transmutation', levelReq: 1, duration: 4, xp: 16, unlock: 'taught',
    inputs: [it('iron_salt', 3), it('ember_essence')], outputs: [it('living_brass')] },
  { id: 'trans_dreamsilk', name: 'Dreamsilk', skill: 'transmutation', levelReq: 8, duration: 4.5, xp: 26, unlock: 'taught',
    inputs: [it('white_salt', 2), it('mist_essence')], outputs: [it('dreamsilk')] },
  { id: 'trans_glass_lens', name: 'Glass Lens', skill: 'transmutation', levelReq: 11, duration: 5, xp: 34, unlock: 'taught',
    inputs: [it('white_salt', 2), it('lumen_essence')], outputs: [it('glass_lens')] },
  { id: 'trans_aether_alloy', name: 'Aether Alloy', skill: 'transmutation', levelReq: 20, duration: 6, xp: 64, unlock: 'taught',
    inputs: [it('astral_salt', 2), it('lumen_ash'), m('aether')], outputs: [it('aether_alloy')] },
  // tools (crafted once; grant a passive bonus while held)
  { id: 'forge_fine_dropper', name: 'Fine Dropper', skill: 'transmutation', levelReq: 9, duration: 6, xp: 50, unlock: 'taught',
    inputs: [it('living_brass', 2), it('glass_lens')], outputs: [it('fine_dropper')] },
  { id: 'forge_jewelers_loupe', name: "Jeweler's Loupe", skill: 'transmutation', levelReq: 13, duration: 6.5, xp: 70, unlock: 'taught',
    inputs: [it('glass_lens', 2), it('dreamsilk')], outputs: [it('jewelers_loupe')] },
  { id: 'forge_master_alembic', name: 'Master Alembic', skill: 'transmutation', levelReq: 22, duration: 8, xp: 150, unlock: 'taught',
    inputs: [it('aether_alloy'), it('living_brass'), it('glass_lens')], outputs: [it('master_alembic')] },
  // luxury goods (sellable; carry quality)
  { id: 'craft_brass_charm', name: 'Brass Charm', skill: 'transmutation', levelReq: 4, duration: 4.5, xp: 24, unlock: 'taught',
    inputs: [it('living_brass', 2)], outputs: [it('brass_charm')] },
  { id: 'craft_dreamsilk_sachet', name: 'Dreamsilk Sachet', skill: 'transmutation', levelReq: 9, duration: 5, xp: 40, unlock: 'taught',
    inputs: [it('dreamsilk', 2)], outputs: [it('dreamsilk_sachet')] },
  { id: 'craft_lens_ornament', name: 'Crystal Lens Ornament', skill: 'transmutation', levelReq: 13, duration: 5.5, xp: 60, unlock: 'taught',
    inputs: [it('glass_lens'), it('lumen_essence')], outputs: [it('lens_ornament')] },
  { id: 'craft_aether_signet', name: 'Aether Signet', skill: 'transmutation', levelReq: 21, duration: 6.5, xp: 120, unlock: 'taught',
    inputs: [it('aether_alloy')], outputs: [it('aether_signet')] },
];

// ── Husbandry: tend creatures over time for reagents (no inputs) ──
const HUSBANDRY: Recipe[] = [
  { id: 'tend_bees', name: 'Tend Honeybees', skill: 'husbandry', levelReq: 1, duration: 4, xp: 11, unlock: 'taught',
    inputs: [], outputs: [it('honey')], blurb: 'A hum of bees, a drip of honey.' },
  { id: 'tend_glowcrabs', name: 'Tend Glowcrabs', skill: 'husbandry', levelReq: 8, duration: 5, xp: 26, unlock: 'taught',
    inputs: [], outputs: [m('aether', 2)], blurb: 'They scuttle and leave Aether in their wake.' },
  { id: 'tend_cinderfowl', name: 'Tend Cinderfowl', skill: 'husbandry', levelReq: 15, duration: 5.5, xp: 40, unlock: 'taught',
    inputs: [], outputs: [it('cinder_egg')], blurb: 'Warm birds that lay glowing eggs.' },
];

// ── Astrology: stargaze for Stardust (the celestial reagent) ──
const ASTROLOGY: Recipe[] = [
  { id: 'chart_minor', name: 'Chart a Minor Constellation', skill: 'astrology', levelReq: 1, duration: 4.5, xp: 12, unlock: 'taught',
    inputs: [], outputs: [it('stardust')], blurb: 'Trace a small pattern; catch its dust.' },
  { id: 'chart_major', name: 'Chart a Major Constellation', skill: 'astrology', levelReq: 10, duration: 5.5, xp: 32, unlock: 'taught',
    inputs: [], outputs: [it('stardust', 2)], blurb: 'Brighter stars, richer dust.' },
  { id: 'chart_grand', name: 'Chart the Grand Wheel', skill: 'astrology', levelReq: 22, duration: 7, xp: 70, unlock: 'taught',
    inputs: [], outputs: [it('stardust', 3)], blurb: 'The whole turning sky, read at once.' },
];

// ── Curation: craft decor that raises shop Coziness ──
const CURATION: Recipe[] = [
  { id: 'craft_chimes', name: 'Hanging Chimes', skill: 'curation', levelReq: 1, duration: 5, xp: 30, unlock: 'taught',
    inputs: [it('glass_lens'), it('stardust', 2)], outputs: [it('decor_chimes')] },
  { id: 'craft_rug', name: 'Woven Rug', skill: 'curation', levelReq: 8, duration: 6, xp: 60, unlock: 'taught',
    inputs: [it('dreamsilk', 2), it('stardust', 2)], outputs: [it('decor_rug')] },
  { id: 'craft_lantern', name: 'Crystal Lantern', skill: 'curation', levelReq: 14, duration: 6.5, xp: 100, unlock: 'taught',
    inputs: [it('glass_lens', 2), it('lumen_essence'), it('stardust', 3)], outputs: [it('decor_lantern')] },
  { id: 'craft_mobile', name: 'Starfall Mobile', skill: 'curation', levelReq: 22, duration: 8, xp: 180, unlock: 'taught',
    inputs: [it('aether_alloy'), it('stardust', 5)], outputs: [it('decor_mobile')] },
];

export const RECIPES: Recipe[] = [
  ...GATHERING, ...AETHERCRAFT, ...HUSBANDRY, ...ASTROLOGY, ...SEPARATION, ...GLASSBLOWING,
  ...CALCINATION, ...CONJUNCTION, ...DISTILLATION, ...TRANSMUTATION, ...INSCRIPTION,
  ...REMEDYCRAFT, ...FELTCRAFT, ...CURATION, ...LORE,
];

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

export const EXPERIMENT_RECIPES = CONJUNCTION;

/** Canonical signature of an input multiset, for experiment matching. */
export function inputSignature(inputs: ItemStack[]): string {
  return inputs.map((i) => `${i.item}x${i.qty}`).sort().join('+');
}

/** Skills that can run a production line (everything except Hospitality). */
export const LINE_SKILLS: SkillId[] = [
  'foraging', 'gardening', 'prospecting', 'tidewalking', 'husbandry', 'astrology', 'aethercraft',
  'separation', 'glassblowing', 'calcination', 'conjunction', 'distillation', 'transmutation',
  'inscription', 'remedycraft', 'feltcraft', 'curation', 'lore',
];
