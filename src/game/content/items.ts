import type { ItemDef } from '../types';
import { ELEMENTS } from './elements';

// ── Element motes (the output of Separation, the input of Conjunction) ──
const MOTES: ItemDef[] = ELEMENTS.map((e) => ({
  id: e.moteId,
  name: `${e.name} Mote`,
  kind: 'mote',
  icon: e.glyph,
  color: e.color,
  tier: 1,
  value: 1,
  blurb: `A drifting spark of pure ${e.name}.`,
}));

// ── Ingredients (gathered, then decomposed for their composition) ──
const INGREDIENTS: ItemDef[] = [
  // Foraged
  { id: 'lavender', name: 'Lavender', kind: 'ingredient', icon: '🪻', tier: 1, value: 3, composition: { aer: 3, aqua: 2, aether: 1 }, blurb: 'Calming, faintly sweet.' },
  { id: 'chamomile', name: 'Chamomile', kind: 'ingredient', icon: '🌼', tier: 1, value: 3, composition: { aqua: 2, aer: 2 }, blurb: 'A little sun on a stem.' },
  { id: 'mistleaf', name: 'Mistleaf', kind: 'ingredient', icon: '🍃', tier: 1, value: 3, composition: { aer: 3, aqua: 1 }, blurb: 'Holds the morning fog.' },
  { id: 'embercap', name: 'Embercap', kind: 'ingredient', icon: '🍄', tier: 1, value: 4, composition: { ignis: 3, terra: 1 }, blurb: 'Warm to the touch even at dawn.' },
  { id: 'thornbud', name: 'Thornbud', kind: 'ingredient', icon: '🥀', tier: 2, value: 5, composition: { ignis: 2, aer: 2 }, blurb: 'Prickly, but sweet within.' },
  { id: 'moondrop', name: 'Moondrop Dew', kind: 'ingredient', icon: '💧', tier: 2, value: 6, composition: { aqua: 2, aether: 2 }, blurb: 'Only gathers under a full moon.' },
  { id: 'dreamcap', name: 'Dreamcap', kind: 'ingredient', icon: '🍄‍🟫', tier: 3, value: 8, composition: { aer: 2, aether: 2, aqua: 1 }, blurb: 'Smells faintly of last night.' },
  { id: 'glimmerbloom', name: 'Glimmerbloom', kind: 'ingredient', icon: '🌸', tier: 3, value: 9, composition: { terra: 1, aether: 2 }, blurb: 'Petals that hum with quiet light.' },
  // Gardened
  { id: 'honeyclover', name: 'Honeyclover', kind: 'ingredient', icon: '🍀', tier: 1, value: 4, composition: { aqua: 1, aer: 1, terra: 1 }, blurb: 'The bees adore it.' },
  { id: 'ironroot', name: 'Ironroot', kind: 'ingredient', icon: '🫚', tier: 1, value: 4, composition: { terra: 3, ignis: 1 }, blurb: 'Stubborn and mineral-rich.' },
  { id: 'saltreed', name: 'Saltreed', kind: 'ingredient', icon: '🌾', tier: 2, value: 5, composition: { terra: 2, aqua: 2 }, blurb: 'Grows where the brine seeps in.' },
  { id: 'frostmint', name: 'Frostmint', kind: 'ingredient', icon: '🌿', tier: 2, value: 5, composition: { aqua: 3, aer: 1 }, blurb: 'Cool enough to numb a fingertip.' },
  { id: 'sunpetal', name: 'Sunpetal', kind: 'ingredient', icon: '🌻', tier: 2, value: 6, composition: { ignis: 2, aer: 1, aether: 1 }, blurb: 'Turns to follow you.' },
  { id: 'dawnberry', name: 'Dawnberry', kind: 'ingredient', icon: '🫐', tier: 3, value: 8, composition: { ignis: 2, aether: 2 }, blurb: 'Ripens only at first light.' },
  { id: 'starthistle', name: 'Starthistle', kind: 'ingredient', icon: '✺', tier: 3, value: 10, composition: { aether: 3, aer: 1 }, blurb: 'Drinks the night sky.' },
];

// ── Essences & compounds (discovered via Conjunction) ──
const ESSENCES: ItemDef[] = [
  // pairwise dyads
  { id: 'clay_essence', name: 'Clay Essence', kind: 'essence', icon: '🟤', color: '#b0875c', tier: 1, value: 7, blurb: 'Earth tempered by water.' },
  { id: 'ember_essence', name: 'Ember Essence', kind: 'essence', icon: '🔥', color: '#e0834f', tier: 1, value: 8, blurb: 'Banked warmth that will not fade.' },
  { id: 'pollen_essence', name: 'Pollen Essence', kind: 'essence', icon: '🌾', color: '#cdbb6a', tier: 1, value: 8, blurb: 'Gold dust on the breeze.' },
  { id: 'loamheart_essence', name: 'Loamheart Essence', kind: 'essence', icon: '🟫', color: '#9c7ab0', tier: 2, value: 13, blurb: 'Soil that remembers magic.' },
  { id: 'steam_essence', name: 'Steam Essence', kind: 'essence', icon: '♨️', color: '#9ec6df', tier: 1, value: 8, blurb: 'Where fire greets water.' },
  { id: 'mist_essence', name: 'Mist Essence', kind: 'essence', icon: '🌫️', color: '#b6cdd8', tier: 1, value: 8, blurb: 'A cool grey hush.' },
  { id: 'moonwater_essence', name: 'Moonwater Essence', kind: 'essence', icon: '🌙', color: '#8fb0e0', tier: 2, value: 13, blurb: 'Tides held in a drop.' },
  { id: 'spark_essence', name: 'Spark Essence', kind: 'essence', icon: '⚡', color: '#edc24a', tier: 1, value: 9, blurb: 'A bright, impatient crackle.' },
  { id: 'lumen_essence', name: 'Lumen Essence', kind: 'essence', icon: '✨', color: '#dcb8f0', tier: 2, value: 14, blurb: 'A captured sliver of dawn.' },
  { id: 'whisper_essence', name: 'Whisper Essence', kind: 'essence', icon: '🌬️', color: '#cdbce6', tier: 2, value: 14, blurb: 'Almost a thought.' },
  // triads
  { id: 'verdant_essence', name: 'Verdant Essence', kind: 'essence', icon: '🌱', color: '#86c07c', tier: 2, value: 16, blurb: 'Green and growing.' },
  { id: 'calm_essence', name: 'Calm Essence', kind: 'essence', icon: '😌', color: '#9bb7e0', tier: 2, value: 16, blurb: 'A held breath, bottled.' },
  { id: 'hearth_essence', name: 'Hearth Essence', kind: 'essence', icon: '🏮', color: '#e09a5a', tier: 2, value: 16, blurb: 'The warmth of a kept home.' },
  { id: 'radiance_essence', name: 'Radiance Essence', kind: 'essence', icon: '🌟', color: '#f0cf6a', tier: 3, value: 22, blurb: 'Light that wants to be seen.' },
  { id: 'tideheart_essence', name: 'Tideheart Essence', kind: 'essence', icon: '🐚', color: '#7fb0c9', tier: 3, value: 22, blurb: 'The pull of the deep, gentled.' },
  // rich element variants
  { id: 'ignis_core', name: 'Ignis Core', kind: 'essence', icon: '🟥', color: '#d9542f', tier: 2, value: 18, blurb: 'Concentrated, dangerous warmth.' },
  { id: 'deep_moonwater', name: 'Deep Moonwater', kind: 'essence', icon: '🌊', color: '#5f7fc0', tier: 3, value: 24, blurb: 'The sea at midnight.' },
  { id: 'greater_whisper', name: 'Greater Whisper', kind: 'essence', icon: '💭', color: '#c4a8ec', tier: 3, value: 24, blurb: 'A thought you can almost name.' },
  // compounds
  { id: 'geyser_tincture', name: 'Geyser Tincture', kind: 'essence', icon: '💥', color: '#bcd4dd', tier: 2, value: 22, blurb: 'Pressure looking for a way out.' },
  { id: 'serenity_distillate', name: 'Serenity Distillate', kind: 'essence', icon: '🕊️', color: '#b6c8ec', tier: 3, value: 30, blurb: 'Quiet, refined to a single drop.' },
  { id: 'daystar_concentrate', name: 'Daystar Concentrate', kind: 'essence', icon: '☀️', color: '#f2cf5e', tier: 4, value: 40, blurb: 'Morning, distilled.' },
  { id: 'dewleaf_concentrate', name: 'Dewleaf Concentrate', kind: 'essence', icon: '🍵', color: '#9ac98a', tier: 3, value: 30, blurb: 'Green vigour in liquid form.' },
  { id: 'dreamwater', name: 'Dreamwater', kind: 'essence', icon: '😴', color: '#8aa0d8', tier: 3, value: 30, blurb: 'Sleep you can pour.' },
  { id: 'voltaic_essence', name: 'Voltaic Essence', kind: 'essence', icon: '🔌', color: '#e6c84a', tier: 3, value: 30, blurb: 'It hums against the glass.' },
  { id: 'bloomdust', name: 'Bloomdust', kind: 'essence', icon: '🌸', color: '#d8a8c0', tier: 2, value: 22, blurb: 'Spring kept in a jar.' },
  { id: 'thermal_loam', name: 'Thermal Loam', kind: 'essence', icon: '🌋', color: '#bb7a52', tier: 4, value: 42, blurb: 'Earth that simmers.' },
  { id: 'lullaby_essence', name: 'Lullaby Essence', kind: 'essence', icon: '🎐', color: '#a8b8ec', tier: 4, value: 48, blurb: 'A song with no words.' },
  { id: 'sunforge_essence', name: 'Sunforge Essence', kind: 'essence', icon: '🌅', color: '#f0b85e', tier: 5, value: 60, blurb: 'Where dawn meets the anvil.' },
];

// ── Vessels (Glassblowing output; required to bottle products) ──
const VESSELS: ItemDef[] = [
  { id: 'vial', name: 'Glass Vial', kind: 'vessel', icon: '🥃', color: '#9fd0dd', tier: 1, value: 2, blurb: 'A simple bottle for simple cures.' },
  { id: 'flask', name: 'Aether Flask', kind: 'vessel', icon: '⏳', color: '#c89bee', tier: 2, value: 8, blurb: 'Glass that can hold a little wonder.' },
];

// ── Products (finished, sellable goods) ──
const PRODUCTS: ItemDef[] = [
  { id: 'sleep_tonic', name: 'Sleep Tonic', kind: 'product', tree: 'remedy', icon: '🧪', color: '#7e9bd8', tier: 1, value: 30, blurb: 'For the baker who cannot rest.' },
  { id: 'warming_salve', name: 'Warming Salve', kind: 'product', tree: 'remedy', icon: '🫙', color: '#e0a06a', tier: 1, value: 34, blurb: 'Rub it in before the frost bites.' },
  { id: 'dewdrop_balm', name: 'Dewdrop Balm', kind: 'product', tree: 'remedy', icon: '💚', color: '#8fc77e', tier: 1, value: 38, blurb: 'Soothes a sun-scorched brow.' },
  { id: 'morning_draught', name: 'Morning Draught', kind: 'product', tree: 'remedy', icon: '🍵', color: '#9ad08a', tier: 2, value: 52, blurb: 'Wakes the dreariest soul.' },
  { id: 'bright_eye_drops', name: 'Bright-Eye Drops', kind: 'product', tree: 'remedy', icon: '👁️', color: '#e6cf6a', tier: 2, value: 58, blurb: 'For squinting over small print.' },
  { id: 'courage_cordial', name: 'Courage Cordial', kind: 'product', tree: 'feeling', icon: '🦁', color: '#e08a52', tier: 2, value: 66, blurb: 'A warm spine in a bottle.' },
  { id: 'clarity_elixir', name: 'Clarity Elixir', kind: 'product', tree: 'remedy', icon: '⚗️', color: '#cba6ec', tier: 3, value: 90, blurb: 'The world, in sharper focus.' },
  { id: 'dreamless_philtre', name: 'Dreamless Philtre', kind: 'product', tree: 'feeling', icon: '🌑', color: '#8aa0d8', tier: 3, value: 110, blurb: 'Rest with no shadows in it.' },
  { id: 'sunforge_potion', name: 'Sunforge Potion', kind: 'product', tree: 'material', icon: '🌅', color: '#f0b85e', tier: 4, value: 170, blurb: 'Liquid daybreak. Handle with care.' },
  { id: 'panacea', name: 'Lesser Panacea', kind: 'product', tree: 'remedy', icon: '🏆', color: '#f0d98a', tier: 5, value: 260, blurb: 'Not quite the Great Work — but close.' },
];

// ── Byproducts ──
const BYPRODUCTS: ItemDef[] = [
  { id: 'muddle', name: 'Muddle', kind: 'byproduct', icon: '🌫️', color: '#8a8090', tier: 0, value: 0, blurb: 'A failed brew. Compost it for a little Terra.' },
];

export const ITEMS: ItemDef[] = [...MOTES, ...INGREDIENTS, ...ESSENCES, ...VESSELS, ...PRODUCTS, ...BYPRODUCTS];

export const ITEM_BY_ID: Record<string, ItemDef> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function getItem(id: string): ItemDef {
  const it = ITEM_BY_ID[id];
  if (!it) throw new Error(`Unknown item: ${id}`);
  return it;
}
