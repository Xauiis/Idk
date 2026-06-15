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
  // Prospecting (Whispering Caves)
  { id: 'quartz', name: 'Quartz', kind: 'ingredient', icon: '🔘', tier: 1, value: 4, composition: { terra: 4 }, blurb: 'Clear, cold and faceted.' },
  { id: 'salt_crystal', name: 'Salt Crystal', kind: 'ingredient', icon: '🧊', tier: 2, value: 5, composition: { terra: 2, aqua: 2 }, blurb: 'Drawn from the cave brine.' },
  { id: 'emberstone', name: 'Emberstone', kind: 'ingredient', icon: '🪨', tier: 2, value: 6, composition: { ignis: 3, terra: 1 }, blurb: 'Hot at the heart of the rock.' },
  { id: 'voidshard', name: 'Voidshard', kind: 'ingredient', icon: '🔺', tier: 3, value: 11, composition: { terra: 1, aether: 3 }, blurb: 'A splinter of buried night.' },
  // Tidewalking (Saltmarsh Coast)
  { id: 'kelp', name: 'Kelp', kind: 'ingredient', icon: '🌿', tier: 1, value: 4, composition: { aqua: 3, aer: 1 }, blurb: 'Long green ribbons of the shallows.' },
  { id: 'tidewort', name: 'Tidewort', kind: 'ingredient', icon: '☘️', tier: 2, value: 5, composition: { aqua: 2, terra: 1, aer: 1 }, blurb: 'Clings to the reed-roots.' },
  { id: 'brinepearl', name: 'Brinepearl', kind: 'ingredient', icon: '🫧', tier: 3, value: 9, composition: { aqua: 2, aether: 2 }, blurb: 'A bead of moonlit seawater.' },
  // Husbandry (tended creatures)
  { id: 'honey', name: 'Honey', kind: 'ingredient', icon: '🍯', tier: 1, value: 5, composition: { aer: 2, aqua: 1, ignis: 1 }, blurb: 'Sweet, golden and slow.' },
  { id: 'cinder_egg', name: 'Cinder Egg', kind: 'ingredient', icon: '🥚', tier: 2, value: 7, composition: { ignis: 3, aether: 1 }, blurb: 'Warm and faintly glowing.' },
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

// ── Distillates (Distillation output; potent refined essences) ──
const DISTILLATES: ItemDef[] = [
  { id: 'serene_distillate', name: 'Serene Distillate', kind: 'essence', icon: '💠', color: '#a8c2ec', tier: 4, value: 36, blurb: 'Calm, reduced to its essence.' },
  { id: 'radiant_distillate', name: 'Radiant Distillate', kind: 'essence', icon: '🔆', color: '#f0d066', tier: 4, value: 40, blurb: 'Light made dense and slow.' },
  { id: 'deepdream_distillate', name: 'Deepdream Distillate', kind: 'essence', icon: '🌌', color: '#7a8fd0', tier: 5, value: 56, blurb: 'A whole night of rest in one bead.' },
  { id: 'solar_distillate', name: 'Solar Distillate', kind: 'essence', icon: '🟡', color: '#f0b045', tier: 6, value: 80, blurb: 'You can feel it warming the vial.' },
];

// ── Quintessence (refined Aether; the arcane bottleneck resource) ──
const ARCANE: ItemDef[] = [
  { id: 'quintessence', name: 'Quintessence', kind: 'essence', icon: '✦', color: '#c89bee', tier: 5, value: 50, blurb: 'Distilled Aether — the fifth element, made manifest.' },
];

// ── Sigils (Inscription output; arcane feedstock for enchanted goods) ──
const SIGILS: ItemDef[] = [
  { id: 'lesser_sigil', name: 'Lesser Sigil', kind: 'material', icon: '⟡', color: '#b08fd0', tier: 3, value: 22, blurb: 'A glyph that holds a little intent.' },
  { id: 'greater_sigil', name: 'Greater Sigil', kind: 'material', icon: '✷', color: '#c08ae0', tier: 4, value: 46, blurb: 'It tugs gently at the air around it.' },
  { id: 'master_sigil', name: 'Master Sigil', kind: 'material', icon: '❖', color: '#d6a8f0', tier: 6, value: 100, blurb: 'A whole sentence of magic in one mark.' },
];

// ── Materials (Calcination & Transmutation feedstock) ──
const MATERIALS: ItemDef[] = [
  { id: 'iron_salt', name: 'Iron Salt', kind: 'material', icon: '🧂', color: '#b98a5a', tier: 1, value: 3, blurb: 'Rusty crystals from calcined root.' },
  { id: 'ember_ash', name: 'Ember Ash', kind: 'material', icon: '⬛', color: '#7a5240', tier: 1, value: 4, blurb: 'Still faintly warm.' },
  { id: 'white_salt', name: 'White Salt', kind: 'material', icon: '⬜', color: '#d8d2c2', tier: 2, value: 5, blurb: 'Pure, fine and bright.' },
  { id: 'lumen_ash', name: 'Lumen Ash', kind: 'material', icon: '✩', color: '#e6cf6a', tier: 3, value: 9, blurb: 'Glows faintly in the dark.' },
  { id: 'astral_salt', name: 'Astral Salt', kind: 'material', icon: '❉', color: '#b89be0', tier: 4, value: 14, blurb: 'Tastes of cold starlight.' },
  { id: 'living_brass', name: 'Living Brass', kind: 'material', icon: '🟨', color: '#cda14a', tier: 2, value: 18, blurb: 'Warm metal that flexes like muscle.' },
  { id: 'dreamsilk', name: 'Dreamsilk', kind: 'material', icon: '🧵', color: '#c9b6e0', tier: 3, value: 24, blurb: 'Woven from settled mist.' },
  { id: 'glass_lens', name: 'Glass Lens', kind: 'material', icon: '🔍', color: '#9fd0dd', tier: 3, value: 28, blurb: 'Ground until the world bends through it.' },
  { id: 'aether_alloy', name: 'Aether Alloy', kind: 'material', icon: '🔷', color: '#9b7ad0', tier: 5, value: 60, blurb: 'It hums when you are not looking.' },
  { id: 'stardust', name: 'Stardust', kind: 'material', icon: '⭐', color: '#cdbce6', tier: 3, value: 16, blurb: 'Swept from the edge of a constellation.' },
];

// ── Decor (Curation output; raises shop Coziness while owned) ──
const DECOR: ItemDef[] = [
  { id: 'decor_chimes', name: 'Hanging Chimes', kind: 'decor', icon: '🎐', color: '#9fd0dd', tier: 1, value: 0, blurb: 'They tinkle softly in the draught. Coziness +5.' },
  { id: 'decor_rug', name: 'Woven Rug', kind: 'decor', icon: '🟫', color: '#c9b6e0', tier: 2, value: 0, blurb: 'Warm underfoot. Coziness +9.' },
  { id: 'decor_lantern', name: 'Crystal Lantern', kind: 'decor', icon: '🏮', color: '#f0cf6a', tier: 3, value: 0, blurb: 'A pool of golden light. Coziness +14.' },
  { id: 'decor_mobile', name: 'Starfall Mobile', kind: 'decor', icon: '🎏', color: '#c89bee', tier: 4, value: 0, blurb: 'Tiny stars drift overhead. Coziness +22.' },
];

// ── Tools (crafted; grant a passive bonus while held) ──
const TOOLS: ItemDef[] = [
  { id: 'fine_dropper', name: 'Fine Dropper', kind: 'tool', icon: '💧', color: '#cda14a', tier: 2, value: 0, blurb: 'A steady hand for Remedycraft: +1 remedy quality.' },
  { id: 'jewelers_loupe', name: "Jeweler's Loupe", kind: 'tool', icon: '🔎', color: '#cda14a', tier: 3, value: 0, blurb: 'A keen eye for treasures: +1 Transmutation quality.' },
  { id: 'master_alembic', name: 'Master Alembic', kind: 'tool', icon: '⚗️', color: '#c89bee', tier: 5, value: 0, blurb: 'Mastercraft glass: +1 quality to every product.' },
];

// ── Vessels (Glassblowing output; required to bottle products) ──
const VESSELS: ItemDef[] = [
  { id: 'vial', name: 'Glass Vial', kind: 'vessel', icon: '🥃', color: '#9fd0dd', tier: 1, value: 2, blurb: 'A simple bottle for simple cures.' },
  { id: 'flask', name: 'Aether Flask', kind: 'vessel', icon: '⏳', color: '#c89bee', tier: 2, value: 8, blurb: 'Glass that can hold a little wonder.' },
];

// ── Tokens ──
const TOKENS: ItemDef[] = [
  { id: 'insight', name: 'Insight', kind: 'token', icon: '💡', color: '#e7c46b', tier: 1, value: 0, blurb: 'A spark of understanding. Spend it in the Research Log.' },
  { id: 'philosophers_stone', name: "Philosopher's Stone", kind: 'token', icon: '🜚', color: '#f0a84a', tier: 9, value: 0, blurb: 'The Great Work, completed. It is warm, and it is alive.' },
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
  { id: 'sunforge_potion', name: 'Sunforge Potion', kind: 'product', tree: 'remedy', icon: '🌅', color: '#f0b85e', tier: 4, value: 170, blurb: 'Liquid daybreak. Handle with care.' },
  { id: 'panacea', name: 'Lesser Panacea', kind: 'product', tree: 'remedy', icon: '🏆', color: '#f0d98a', tier: 5, value: 260, blurb: 'Not quite the Great Work — but close.' },
  // distillate-grade remedies (Phase 2)
  { id: 'tranquil_balm', name: 'Tranquil Balm', kind: 'product', tree: 'feeling', icon: '🪷', color: '#a8c2ec', tier: 4, value: 150, blurb: 'Stillness you can wear all day.' },
  { id: 'dawnlight_tonic', name: 'Dawnlight Tonic', kind: 'product', tree: 'remedy', icon: '🌞', color: '#f0d066', tier: 5, value: 220, blurb: 'Bottled sunrise for the dreariest dark.' },
  // Bottled Feelings (Phase 3 — Feltcraft; each needs Aether)
  { id: 'feeling_calm', name: 'Bottled Calm', kind: 'product', tree: 'feeling', icon: '🕊️', color: '#9bb7e0', tier: 1, value: 44, blurb: 'A slow exhale for a racing heart.' },
  { id: 'feeling_courage', name: 'Bottled Courage', kind: 'product', tree: 'feeling', icon: '🔥', color: '#e08a52', tier: 2, value: 60, blurb: 'For the moment before the leap.' },
  { id: 'feeling_focus', name: 'Bottled Focus', kind: 'product', tree: 'feeling', icon: '🎯', color: '#cdbce6', tier: 3, value: 84, blurb: 'The world narrows to the work at hand.' },
  { id: 'feeling_wonder', name: 'Bottled Wonder', kind: 'product', tree: 'feeling', icon: '🌠', color: '#dcb8f0', tier: 4, value: 130, blurb: 'The sky, the first time you really saw it.' },
  { id: 'feeling_nostalgia', name: 'Bottled Nostalgia', kind: 'product', tree: 'feeling', icon: '📷', color: '#bca0d0', tier: 4, value: 150, blurb: 'A warm afternoon that never quite happened.' },
  { id: 'feeling_serenity', name: 'Bottled Serenity', kind: 'product', tree: 'feeling', icon: '🪷', color: '#a8c2ec', tier: 5, value: 210, blurb: 'Peace so deep it hums.' },
  { id: 'feeling_euphoria', name: 'Bottled Euphoria', kind: 'product', tree: 'feeling', icon: '🎆', color: '#f0a8d8', tier: 6, value: 320, blurb: 'Pure delight, corked before it escapes.' },
  // Materials-tree luxury goods (Transmutation; sellable, carry quality)
  { id: 'brass_charm', name: 'Brass Charm', kind: 'product', tree: 'material', icon: '🔔', color: '#cda14a', tier: 2, value: 90, blurb: 'Wards off a little bad luck.' },
  { id: 'dreamsilk_sachet', name: 'Dreamsilk Sachet', kind: 'product', tree: 'material', icon: '🎀', color: '#c9b6e0', tier: 3, value: 130, blurb: 'Tucked under a pillow for sweet dreams.' },
  { id: 'lens_ornament', name: 'Crystal Lens Ornament', kind: 'product', tree: 'material', icon: '💎', color: '#9fd0dd', tier: 4, value: 190, blurb: 'Catches the light and scatters rainbows.' },
  { id: 'aether_signet', name: 'Aether Signet', kind: 'product', tree: 'material', icon: '💍', color: '#9b7ad0', tier: 5, value: 340, blurb: 'A ring that remembers its wearer.' },
];

// ── Byproducts ──
const BYPRODUCTS: ItemDef[] = [
  { id: 'muddle', name: 'Muddle', kind: 'byproduct', icon: '🌫️', color: '#8a8090', tier: 0, value: 0, blurb: 'A failed brew. Compost it for a little Terra.' },
];

export const ITEMS: ItemDef[] = [
  ...MOTES, ...INGREDIENTS, ...ESSENCES, ...DISTILLATES, ...ARCANE, ...SIGILS,
  ...MATERIALS, ...TOOLS, ...DECOR, ...VESSELS, ...TOKENS, ...PRODUCTS, ...BYPRODUCTS,
];

/** Coziness contributed by each decor item while it's owned. */
export const DECOR_COZINESS: Record<string, number> = {
  decor_chimes: 5, decor_rug: 9, decor_lantern: 14, decor_mobile: 22,
};

/** Total shop Coziness from owned decor. */
export function coziness(inventory: Record<string, number>): number {
  let n = 0;
  for (const [id, pts] of Object.entries(DECOR_COZINESS)) if ((inventory[id] ?? 0) > 0) n += pts;
  return n;
}

/** Tool bonuses, keyed by tool item id. */
export const TOOL_BONUS: Record<string, import('../types').ToolBonus> = {
  fine_dropper: { quality: { skill: 'remedycraft', amount: 1 } },
  jewelers_loupe: { quality: { skill: 'transmutation', amount: 1 } },
  master_alembic: { quality: { skill: 'all', amount: 1 } },
};

export const ITEM_BY_ID: Record<string, ItemDef> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function getItem(id: string): ItemDef {
  const it = ITEM_BY_ID[id];
  if (!it) throw new Error(`Unknown item: ${id}`);
  return it;
}
