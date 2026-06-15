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
  { id: 'lavender', name: 'Lavender', kind: 'ingredient', icon: '🪻', tier: 1, value: 3, composition: { aer: 3, aqua: 2, aether: 1 }, blurb: 'Calming, faintly sweet.' },
  { id: 'chamomile', name: 'Chamomile', kind: 'ingredient', icon: '🌼', tier: 1, value: 3, composition: { aqua: 2, aer: 2 }, blurb: 'A little sun on a stem.' },
  { id: 'embercap', name: 'Embercap', kind: 'ingredient', icon: '🍄', tier: 1, value: 4, composition: { ignis: 3, terra: 1 }, blurb: 'Warm to the touch even at dawn.' },
  { id: 'mistleaf', name: 'Mistleaf', kind: 'ingredient', icon: '🍃', tier: 1, value: 3, composition: { aer: 3, aqua: 1 }, blurb: 'Holds the morning fog.' },
  { id: 'moondrop', name: 'Moondrop Dew', kind: 'ingredient', icon: '💧', tier: 2, value: 6, composition: { aqua: 2, aether: 2 }, blurb: 'Only gathers under a full moon.' },
  { id: 'sunpetal', name: 'Sunpetal', kind: 'ingredient', icon: '🌻', tier: 2, value: 6, composition: { ignis: 2, aer: 1, aether: 1 }, blurb: 'Turns to follow you.' },
  { id: 'ironroot', name: 'Ironroot', kind: 'ingredient', icon: '🫚', tier: 1, value: 4, composition: { terra: 3, ignis: 1 }, blurb: 'Stubborn and mineral-rich.' },
  { id: 'honeyclover', name: 'Honeyclover', kind: 'ingredient', icon: '🍀', tier: 1, value: 4, composition: { aqua: 1, aer: 1, terra: 1 }, blurb: 'The bees adore it.' },
  { id: 'frostmint', name: 'Frostmint', kind: 'ingredient', icon: '🌿', tier: 2, value: 5, composition: { aqua: 3, aer: 1 }, blurb: 'Cool enough to numb a fingertip.' },
  { id: 'glimmerbloom', name: 'Glimmerbloom', kind: 'ingredient', icon: '🌸', tier: 3, value: 9, composition: { terra: 1, aether: 2 }, blurb: 'Petals that hum with quiet light.' },
];

// ── Essences (combined intermediates, discovered via Conjunction) ──
const ESSENCES: ItemDef[] = [
  { id: 'steam_essence', name: 'Steam Essence', kind: 'essence', icon: '♨️', color: '#9ec6df', tier: 1, value: 8, blurb: 'Where fire greets water.' },
  { id: 'calm_essence', name: 'Calm Essence', kind: 'essence', icon: '😌', color: '#9bb7e0', tier: 1, value: 10, blurb: 'A held breath, bottled.' },
  { id: 'ember_essence', name: 'Ember Essence', kind: 'essence', icon: '🔥', color: '#e0834f', tier: 1, value: 9, blurb: 'Banked warmth that will not fade.' },
  { id: 'whisper_essence', name: 'Whisper Essence', kind: 'essence', icon: '🌬️', color: '#cdbce6', tier: 2, value: 14, blurb: 'Almost a thought.' },
  { id: 'verdant_essence', name: 'Verdant Essence', kind: 'essence', icon: '🌱', color: '#86c07c', tier: 2, value: 13, blurb: 'Green and growing.' },
  { id: 'lumen_essence', name: 'Lumen Essence', kind: 'essence', icon: '✨', color: '#dcb8f0', tier: 3, value: 20, blurb: 'A captured sliver of dawn.' },
];

// ── Products (finished, sellable goods) ──
const PRODUCTS: ItemDef[] = [
  { id: 'sleep_tonic', name: 'Sleep Tonic', kind: 'product', tree: 'remedy', icon: '🧪', color: '#7e9bd8', tier: 1, value: 28, blurb: 'For the baker who cannot rest.' },
  { id: 'warming_salve', name: 'Warming Salve', kind: 'product', tree: 'remedy', icon: '🫙', color: '#e0a06a', tier: 1, value: 30, blurb: 'Rub it in before the frost bites.' },
  { id: 'morning_draught', name: 'Morning Draught', kind: 'product', tree: 'remedy', icon: '🍵', color: '#8fc77e', tier: 2, value: 42, blurb: 'Wakes the dreariest soul.' },
  { id: 'clarity_elixir', name: 'Clarity Elixir', kind: 'product', tree: 'remedy', icon: '⚗️', color: '#cba6ec', tier: 3, value: 70, blurb: 'The world, in sharper focus.' },
];

// ── Byproducts ──
const BYPRODUCTS: ItemDef[] = [
  { id: 'muddle', name: 'Muddle', kind: 'byproduct', icon: '🌫️', color: '#8a8090', tier: 0, value: 0, blurb: 'A failed brew. Compost it for a little Terra.' },
];

export const ITEMS: ItemDef[] = [...MOTES, ...INGREDIENTS, ...ESSENCES, ...PRODUCTS, ...BYPRODUCTS];

export const ITEM_BY_ID: Record<string, ItemDef> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function getItem(id: string): ItemDef {
  const it = ITEM_BY_ID[id];
  if (!it) throw new Error(`Unknown item: ${id}`);
  return it;
}
