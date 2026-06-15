// Core type definitions for the Quintessence engine.
// The engine is generic: it knows about Items, Recipes, and Skills — never
// about specific content. All concrete content lives in src/game/content.

export type ElementId = 'terra' | 'aqua' | 'ignis' | 'aer' | 'aether';

export type SkillId =
  | 'foraging'
  | 'gardening'
  | 'aethercraft'
  | 'separation'
  | 'glassblowing'
  | 'calcination'
  | 'conjunction'
  | 'distillation'
  | 'transmutation'
  | 'inscription'
  | 'remedycraft'
  | 'feltcraft'
  | 'lore'
  | 'hospitality';

/** Broad category an item belongs to — used for inventory grouping & filtering. */
export type ItemKind =
  | 'mote' // raw element essence
  | 'ingredient' // gathered flora/minerals
  | 'essence' // refined / combined intermediate
  | 'material' // salts, ash, alloys — feedstock for the Materials tree
  | 'tool' // a crafted item that grants a passive bonus while owned
  | 'vessel' // glassware that holds finished goods
  | 'product' // a finished, sellable good (carries a quality grade)
  | 'token' // abstract currency-like items (Insight)
  | 'byproduct'; // muddle, compost, etc.

export type ProductTree = 'remedy' | 'feeling' | 'material';

export interface ElementDef {
  id: ElementId;
  name: string;
  glyph: string; // alchemical symbol
  color: string;
  moteId: string; // the item id of this element's mote
  blurb: string;
}

export interface ItemDef {
  id: string;
  name: string;
  kind: ItemKind;
  icon: string; // emoji or glyph
  color?: string;
  tier: number;
  value: number; // base sell value in coins
  tree?: ProductTree; // for products
  /** Elemental composition — what this item decomposes into via Separation. */
  composition?: Partial<Record<ElementId, number>>;
  blurb?: string;
}

export interface ItemStack {
  item: string;
  qty: number;
}

/**
 * A Recipe is the universal unit of work. Gathering, separating, combining and
 * crafting are all Recipes — they differ only in their inputs, outputs and skill.
 */
export interface Recipe {
  id: string;
  name: string;
  skill: SkillId;
  levelReq: number;
  duration: number; // seconds for one cycle
  xp: number; // skill xp granted per cycle
  inputs: ItemStack[]; // empty for gathering
  outputs: ItemStack[];
  /** How this recipe becomes available to the player. */
  unlock: 'taught' | 'experiment';
  /** If set, the recipe stays hidden until this research perk is owned. */
  perkReq?: string;
  blurb?: string;
}

/** Tool items grant a passive bonus to a skill (or all) while held in the larder. */
export interface ToolBonus {
  /** +N product quality grades for this skill, or 'all'. */
  quality?: { skill: SkillId | 'all'; amount: number };
}

export interface SkillDef {
  id: SkillId;
  name: string;
  cluster: 'gather' | 'process' | 'product' | 'support';
  icon: string;
  color: string;
  blurb: string;
}

export interface Order {
  id: string;
  customer: string;
  customerIcon: string;
  product: string; // item id
  qty: number;
  minQuality: number; // 0..3 — the lowest grade this customer will accept
  coins: number;
  reputation: number;
  hospitalityXp: number;
  story: string;
  createdAt: number; // tick timestamp (seconds of play)
}

/** A single transient notification surfaced in the activity log. */
export interface LogEntry {
  id: number;
  text: string;
  tone: 'info' | 'good' | 'great' | 'muted';
  at: number;
}
