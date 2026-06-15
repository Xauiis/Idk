import { create } from 'zustand';
import type { LogEntry, Order, SkillId } from './types';
import { levelForXp } from './xp';
import { gradeFor, pkey, baseId, quality } from './quality';
import {
  ORDER_TEMPLATES,
  RECIPE_BY_ID,
  getItem,
  inputSignature,
  EXPERIMENT_RECIPES,
  UPGRADES,
  PERK_BY_ID,
  BIOME_BY_ID,
  seasonAt,
  FESTIVAL_BONUS,
  moonAt,
  coziness,
  GREAT_WORK,
  BLOOM_SPEED_PER,
  BLOOM_START_COINS,
  QUESTS,
  type QuestMetrics,
  speedMultipliers,
  productQualityBonus,
  yieldBonus,
  insightMultiplier,
} from './content';

const SAVE_KEY = 'quintessence.save.v1';
const SAVE_VERSION = 1;
const OFFLINE_CAP_SECONDS = 8 * 3600;
const LOG_LIMIT = 60;

// Production flows along this order each tick, so a gather→separate→combine→craft
// chain can move one step within a single tick.
const SKILL_ORDER: SkillId[] = [
  'foraging', 'gardening', 'prospecting', 'tidewalking', 'husbandry', 'astrology', 'aethercraft',
  'separation', 'glassblowing', 'calcination', 'conjunction', 'distillation', 'transmutation',
  'inscription', 'remedycraft', 'feltcraft', 'curation', 'lore', 'hospitality',
];

/** Order-book capacity grows as the town comes to rely on you. */
export function maxOrders(reputation: number): number {
  return 5 + Math.min(5, Math.floor(reputation / 40)); // 5 → 10 slots
}

export interface GameState {
  version: number;
  playSeconds: number;
  lastSaved: number; // epoch ms

  coins: number;
  reputation: number;
  inventory: Record<string, number>;
  skillXp: Record<SkillId, number>;

  activeRecipe: Record<SkillId, string | null>;
  progress: Record<SkillId, number>;
  lineCap: Record<SkillId, number | null>; // pause a line once it holds this many of its output

  discovered: string[]; // discovered conjunction recipe ids
  upgrades: string[]; // owned shop upgrade ids
  perks: string[]; // owned research perk ids
  biomes: string[]; // charted biome ids
  orders: Order[];
  nextOrderAt: number;

  presets: LinePreset[];

  log: LogEntry[];
  logSeq: number;
  orderSeq: number;
  presetSeq: number;

  greatWork: number; // stages of the Magnum Opus completed (0..4)
  opusComplete: boolean;
  blooms: number; // New Bloom prestige count (permanent legacy bonus)
  questsClaimed: string[]; // completed onboarding quests

  stats: { itemsMade: number; ordersFilled: number; discoveries: number };

  // ── actions ──
  tick: (dt: number) => void;
  setActive: (skill: SkillId, recipeId: string | null) => void;
  setLineCap: (skill: SkillId, cap: number | null) => void;
  stopAllLines: () => void;
  savePreset: (name: string) => void;
  applyPreset: (id: string) => void;
  deletePreset: (id: string) => void;
  experiment: (items: Record<string, number>) => ExperimentResult;
  fulfillOrder: (orderId: string) => void;
  declineOrder: (orderId: string) => void;
  buyUpgrade: (id: string) => void;
  buyPerk: (id: string) => void;
  unlockBiome: (id: string) => void;
  advanceGreatWork: () => boolean;
  bloom: () => void;
  compostMuddle: () => void;
  hardReset: () => void;
  applyOffline: () => { seconds: number; gains: Record<string, number>; coins: number } | null;
}

export type ExperimentResult =
  | { kind: 'discovered' | 'made'; item: string; name: string }
  | { kind: 'locked'; level: number }
  | { kind: 'muddle' }
  | { kind: 'empty' };

export interface LinePreset {
  id: string;
  name: string;
  active: Record<SkillId, string | null>;
  caps: Record<SkillId, number | null>;
}

function emptySkillMap<T>(value: T): Record<SkillId, T> {
  return {
    foraging: value, gardening: value, prospecting: value, tidewalking: value, husbandry: value,
    astrology: value, aethercraft: value, separation: value, glassblowing: value, calcination: value,
    conjunction: value, distillation: value, transmutation: value, inscription: value,
    remedycraft: value, feltcraft: value, curation: value, lore: value, hospitality: value,
  };
}

function freshState() {
  return {
    version: SAVE_VERSION,
    playSeconds: 0,
    lastSaved: Date.now(),
    coins: 25,
    reputation: 0,
    inventory: {} as Record<string, number>,
    skillXp: emptySkillMap(0),
    activeRecipe: emptySkillMap<string | null>(null),
    progress: emptySkillMap(0),
    lineCap: emptySkillMap<number | null>(null),
    discovered: [] as string[],
    upgrades: [] as string[],
    perks: [] as string[],
    biomes: ['commons'] as string[],
    orders: [] as Order[],
    nextOrderAt: 6,
    greatWork: 0,
    opusComplete: false,
    blooms: 0,
    questsClaimed: [] as string[],
    presets: [] as LinePreset[],
    log: [] as LogEntry[],
    logSeq: 1,
    orderSeq: 1,
    presetSeq: 1,
    stats: { itemsMade: 0, ordersFilled: 0, discoveries: 0 },
  };
}

// ── pure inventory helpers (operate on a plain record) ──
function canAfford(inv: Record<string, number>, inputs: { item: string; qty: number }[]): boolean {
  return inputs.every((i) => (inv[i.item] ?? 0) >= i.qty);
}
function take(inv: Record<string, number>, inputs: { item: string; qty: number }[]) {
  for (const i of inputs) inv[i.item] = (inv[i.item] ?? 0) - i.qty;
}
function give(inv: Record<string, number>, outputs: { item: string; qty: number }[]) {
  for (const o of outputs) inv[o.item] = (inv[o.item] ?? 0) + o.qty;
}
/** Total held of an item across all quality grades (products) or its flat key. */
function countBase(inv: Record<string, number>, itemId: string): number {
  let n = inv[itemId] ?? 0;
  const prefix = `${itemId}#`;
  for (const key in inv) if (key.startsWith(prefix)) n += inv[key];
  return n;
}

/** Advance every running line through as many whole cycles as `dt` allows. */
function simulate(state: GameState, dt: number, opts: { spawnOrders: boolean }) {
  const inv = { ...state.inventory };
  const xp = { ...state.skillXp };
  const progress = { ...state.progress };
  let itemsMade = state.stats.itemsMade;
  const speed = speedMultipliers(state.upgrades, state.perks);
  const seasonIdx = seasonAt(state.playSeconds).index;
  const moon = moonAt(state.playSeconds).index; // 0 new, 1 waxing, 2 full, 3 waning
  const legacy = 1 + BLOOM_SPEED_PER * state.blooms; // permanent New Bloom speed bonus
  const GATHER_SKILLS = new Set<SkillId>(['foraging', 'gardening', 'prospecting', 'tidewalking', 'husbandry', 'astrology', 'aethercraft']);

  for (const skill of SKILL_ORDER) {
    const recipeId = state.activeRecipe[skill];
    if (!recipeId) continue;
    const recipe = RECIPE_BY_ID[recipeId];
    if (!recipe) continue;
    // seasonal gatherables pause out of their season
    if (recipe.seasons && !recipe.seasons.includes(seasonIdx)) continue;

    const effDur = recipe.duration / ((speed[skill] ?? 1) * legacy);
    const producesProduct = recipe.outputs.some((o) => getItem(o.item).kind === 'product');
    const isGather = GATHER_SKILLS.has(skill);
    // quality: research/tools + Waning-moon boon
    const qBonus = producesProduct ? productQualityBonus(skill, state.perks, inv) + (moon === 3 ? 1 : 0) : 0;
    // gather yield: research perk + Waxing-moon boon
    const gather = (isGather ? yieldBonus(skill, state.perks) : 0) + (isGather && moon === 1 ? 1 : 0);
    // insight: research perk + New-moon boon
    const insightMul = skill === 'lore' ? insightMultiplier(state.perks) * (moon === 0 ? 1.5 : 1) : 1;
    const fullMoonAether = skill === 'aethercraft' && moon === 2;
    const cap = state.lineCap[skill];
    const primary = recipe.outputs[0]?.item;

    let acc = (progress[skill] ?? 0) + dt;
    if (acc > effDur * 4) acc = effDur * 4; // cap banked time when stalled

    while (acc >= effDur) {
      if (cap != null && primary && countBase(inv, primary) >= cap) {
        acc = effDur; // programmed pause: enough on the shelf
        break;
      }
      if (!canAfford(inv, recipe.inputs)) {
        acc = effDur; // hold ready; completes the instant inputs arrive
        break;
      }
      take(inv, recipe.inputs);
      const level = producesProduct ? levelForXp(xp[skill]) : 0;
      for (const o of recipe.outputs) {
        const def = getItem(o.item);
        let qty = o.qty;
        if (gather && recipe.inputs.length === 0) qty += gather; // bonus herbs on gather
        if (fullMoonAether && o.item === 'mote_aether') qty += 1; // Full-moon Aether boon
        if (def.kind === 'product') {
          const grade = gradeFor(level, recipe.levelReq, qBonus);
          const key = pkey(o.item, grade);
          inv[key] = (inv[key] ?? 0) + qty;
        } else if (o.item === 'insight') {
          inv.insight = (inv.insight ?? 0) + Math.round(qty * insightMul);
        } else {
          inv[o.item] = (inv[o.item] ?? 0) + qty;
        }
        itemsMade += qty;
      }
      xp[skill] += recipe.xp;
      acc -= effDur;
    }
    progress[skill] = acc;
  }

  // Order generation & expiry
  const playSeconds = state.playSeconds + dt;
  let orders = state.orders.filter((o) => o.expiresAt > playSeconds); // customers wander off (no penalty)
  let nextOrderAt = state.nextOrderAt;
  let orderSeq = state.orderSeq;
  if (opts.spawnOrders && playSeconds >= nextOrderAt && orders.length < maxOrders(state.reputation)) {
    const tpl = ORDER_TEMPLATES[Math.floor(Math.random() * ORDER_TEMPLATES.length)];
    const qty = tpl.qtyRange[0] + Math.floor(Math.random() * (tpl.qtyRange[1] - tpl.qtyRange[0] + 1));
    const product = getItem(tpl.product);
    const featured = product.tree === seasonAt(playSeconds).featuredTree;
    const coins = Math.round(product.value * qty * 1.6 * (featured ? FESTIVAL_BONUS : 1));
    orders = [
      ...orders,
      {
        id: `o${orderSeq}`,
        customer: tpl.customer,
        customerIcon: tpl.customerIcon,
        product: tpl.product,
        qty,
        minQuality: tpl.minQuality ?? 0,
        coins, // base reward at Fine quality (incl. festival bonus)
        reputation: qty,
        hospitalityXp: Math.round(product.value * qty * 0.6),
        story: tpl.story,
        createdAt: Math.floor(playSeconds),
        // 3–6 minutes, extended by shop Coziness (patient customers)
        expiresAt: playSeconds + 180 + Math.random() * 180 + coziness(inv) * 2,
        featured,
      },
    ];
    orderSeq += 1;
    nextOrderAt = playSeconds + 18 + Math.random() * 22;
  }

  return {
    inventory: inv,
    skillXp: xp,
    progress,
    playSeconds,
    orders,
    nextOrderAt,
    orderSeq,
    stats: { ...state.stats, itemsMade },
  };
}

export const useGame = create<GameState>((set, get) => ({
  ...freshState(),

  tick: (dt) => {
    const s = get();
    set(simulate(s, dt, { spawnOrders: true }));
    resolveQuests();
  },

  setActive: (skill, recipeId) => {
    set((s) => ({
      activeRecipe: { ...s.activeRecipe, [skill]: recipeId },
      progress: { ...s.progress, [skill]: 0 },
    }));
  },

  setLineCap: (skill, cap) => {
    set((s) => ({ lineCap: { ...s.lineCap, [skill]: cap != null && cap > 0 ? Math.floor(cap) : null } }));
  },

  stopAllLines: () => {
    set((s) => ({
      activeRecipe: emptySkillMap<string | null>(null),
      progress: emptySkillMap(0),
      log: pushLog(s, 'All lines stopped. The lab falls quiet.', 'info'),
      logSeq: s.logSeq + 1,
    }));
  },

  savePreset: (name) => {
    const s = get();
    const preset: LinePreset = {
      id: `p${s.presetSeq}`,
      name: name.trim() || `Preset ${s.presetSeq}`,
      active: { ...s.activeRecipe },
      caps: { ...s.lineCap },
    };
    set({
      presets: [...s.presets, preset],
      presetSeq: s.presetSeq + 1,
      log: pushLog(s, `Saved line preset “${preset.name}”.`, 'good'),
      logSeq: s.logSeq + 1,
    });
  },

  applyPreset: (id) => {
    const s = get();
    const preset = s.presets.find((p) => p.id === id);
    if (!preset) return;
    set({
      activeRecipe: { ...emptySkillMap<string | null>(null), ...preset.active },
      lineCap: { ...emptySkillMap<number | null>(null), ...preset.caps },
      progress: emptySkillMap(0),
      log: pushLog(s, `Loaded preset “${preset.name}”. The lab hums to life.`, 'great'),
      logSeq: s.logSeq + 1,
    });
  },

  deletePreset: (id) => {
    set((s) => ({ presets: s.presets.filter((p) => p.id !== id) }));
  },

  experiment: (items) => {
    const s = get();
    const inputs = Object.entries(items)
      .filter(([, q]) => q > 0)
      .map(([item, q]) => ({ item, qty: q }));
    if (inputs.length === 0) return { kind: 'empty' };

    const inv = { ...s.inventory };
    if (!canAfford(inv, inputs)) return { kind: 'empty' };

    const sig = inputSignature(inputs);
    const match = EXPERIMENT_RECIPES.find((r) => inputSignature(r.inputs) === sig);
    const conjLevel = levelForXp(s.skillXp.conjunction);

    // No match → harmless muddle. If the right *elements* are present but the
    // proportions are wrong, nudge the player rather than leave them guessing.
    if (!match) {
      take(inv, inputs);
      give(inv, [{ item: 'muddle', qty: 1 }]);
      const selSet = inputs.map((i) => i.item).sort().join(',');
      const nearMiss = EXPERIMENT_RECIPES.some(
        (r) => !s.discovered.includes(r.id) && [...new Set(r.inputs.map((i) => i.item))].sort().join(',') === selSet,
      );
      set({
        inventory: inv,
        log: pushLog(
          s,
          nearMiss ? 'The right elements are here — but the proportions feel off…' : 'That fizzled into a puff of Muddle. Worth a try!',
          nearMiss ? 'info' : 'muted',
        ),
        logSeq: s.logSeq + 1,
      });
      return { kind: 'muddle' };
    }

    // Match but under-levelled → no charge, gentle nudge.
    if (match.levelReq > conjLevel) {
      set({
        log: pushLog(s, `You sense a recipe here, but need Conjunction ${match.levelReq}.`, 'info'),
        logSeq: s.logSeq + 1,
      });
      return { kind: 'locked', level: match.levelReq };
    }

    // Match but gated behind research → no charge, gentle nudge.
    if (match.perkReq && !s.perks.includes(match.perkReq)) {
      set({
        log: pushLog(s, 'This blend resists you — it awaits deeper research first.', 'info'),
        logSeq: s.logSeq + 1,
      });
      return { kind: 'locked', level: 0 };
    }

    take(inv, inputs);
    give(inv, match.outputs);
    const out = getItem(match.outputs[0].item);
    const already = s.discovered.includes(match.id);
    const xp = { ...s.skillXp };
    xp.conjunction += match.xp + (already ? 0 : Math.round(match.xp * 2));

    set({
      inventory: inv,
      skillXp: xp,
      discovered: already ? s.discovered : [...s.discovered, match.id],
      stats: { ...s.stats, discoveries: s.stats.discoveries + (already ? 0 : 1), itemsMade: s.stats.itemsMade + 1 },
      log: pushLog(
        s,
        already ? `Combined into ${out.name}.` : `✦ Discovery! You learned to make ${out.name}.`,
        already ? 'good' : 'great',
      ),
      logSeq: s.logSeq + 1,
    });
    return { kind: already ? 'made' : 'discovered', item: out.id, name: out.name };
  },

  fulfillOrder: (orderId) => {
    const s = get();
    const order = s.orders.find((o) => o.id === orderId);
    if (!order) return;

    // Eligible product stacks are those at or above the customer's minimum grade.
    // Spend the lowest acceptable grades first to preserve your finest stock.
    const stacks = [0, 1, 2, 3]
      .filter((g) => g >= order.minQuality)
      .map((g) => ({ g, key: pkey(order.product, g), have: s.inventory[pkey(order.product, g)] ?? 0 }))
      .filter((x) => x.have > 0)
      .sort((a, b) => a.g - b.g);
    const available = stacks.reduce((sum, x) => sum + x.have, 0);
    if (available < order.qty) return;

    const inv = { ...s.inventory };
    let need = order.qty;
    let valueSum = 0;
    for (const st of stacks) {
      if (need <= 0) break;
      const take = Math.min(st.have, need);
      inv[st.key] = st.have - take;
      if (inv[st.key] <= 0) delete inv[st.key];
      valueSum += take * quality(st.g).valueMult;
      need -= take;
    }
    const avgMult = valueSum / order.qty;
    const cozyMult = 1 + coziness(s.inventory) / 200; // cosier shop → bigger tips
    const coins = Math.round(order.coins * avgMult * cozyMult);
    const xp = { ...s.skillXp };
    xp.hospitality += order.hospitalityXp;
    set({
      inventory: inv,
      coins: s.coins + coins,
      reputation: s.reputation + order.reputation,
      skillXp: xp,
      orders: s.orders.filter((o) => o.id !== orderId),
      stats: { ...s.stats, ordersFilled: s.stats.ordersFilled + 1 },
      log: pushLog(s, `${order.customer} is delighted! +${coins}🪙 +${order.reputation}❤`, 'great'),
      logSeq: s.logSeq + 1,
    });
  },

  declineOrder: (orderId) => {
    set((s) => ({ orders: s.orders.filter((o) => o.id !== orderId) }));
  },

  buyUpgrade: (id) => {
    const s = get();
    const up = UPGRADES.find((u) => u.id === id);
    if (!up || s.upgrades.includes(id) || s.coins < up.cost) return;
    set({
      coins: s.coins - up.cost,
      upgrades: [...s.upgrades, id],
      log: pushLog(s, `Bought ${up.name}. ${up.effectText}`, 'good'),
      logSeq: s.logSeq + 1,
    });
  },

  buyPerk: (id) => {
    const s = get();
    const perk = PERK_BY_ID[id];
    if (!perk || s.perks.includes(id)) return;
    if (perk.requires && !s.perks.includes(perk.requires)) return;
    const have = s.inventory.insight ?? 0;
    if (have < perk.cost) return;
    const inv = { ...s.inventory, insight: have - perk.cost };
    set({
      inventory: inv,
      perks: [...s.perks, id],
      log: pushLog(s, `Researched ${perk.name}. ${perk.desc}`, 'great'),
      logSeq: s.logSeq + 1,
    });
  },

  unlockBiome: (id) => {
    const s = get();
    const biome = BIOME_BY_ID[id];
    if (!biome || s.biomes.includes(id)) return;
    if (s.reputation < biome.repReq || s.coins < biome.cost) return;
    set({
      coins: s.coins - biome.cost,
      biomes: [...s.biomes, id],
      log: pushLog(s, `Charted ${biome.name}! New ingredients await.`, 'great'),
      logSeq: s.logSeq + 1,
    });
  },

  advanceGreatWork: () => {
    const s = get();
    if (s.opusComplete) return false;
    const stage = GREAT_WORK[s.greatWork];
    if (!stage) return false;
    // gates
    if (stage.skillReq && levelForXp(s.skillXp[stage.skillReq.skill]) < stage.skillReq.level) return false;
    if (stage.totalLevelReq) {
      const total = (Object.keys(s.skillXp) as SkillId[]).reduce((sum, k) => sum + levelForXp(s.skillXp[k]), 0);
      if (total < stage.totalLevelReq) return false;
    }
    if (!canAfford(s.inventory, stage.inputs)) return false;

    const inv = { ...s.inventory };
    take(inv, stage.inputs);
    const done = s.greatWork + 1;
    const complete = done >= GREAT_WORK.length;
    if (complete) inv.philosophers_stone = (inv.philosophers_stone ?? 0) + 1;
    set({
      inventory: inv,
      greatWork: done,
      opusComplete: complete,
      log: pushLog(
        s,
        complete ? '🜚 THE GREAT WORK IS COMPLETE. The Philosopher’s Stone is yours.' : `Completed ${stage.latin} — ${stage.name}.`,
        'great',
      ),
      logSeq: s.logSeq + 1,
    });
    return true;
  },

  bloom: () => {
    const s = get();
    if (!s.opusComplete) return;
    const blooms = s.blooms + 1;
    set({
      ...freshState(),
      blooms,
      coins: 25 + BLOOM_START_COINS * blooms,
      log: [{ id: 1, text: `🌸 New Bloom! Legacy bonus is now +${Math.round(BLOOM_SPEED_PER * blooms * 100)}% to every line.`, tone: 'great', at: 0 }],
      logSeq: 2,
    });
  },

  compostMuddle: () => {
    const s = get();
    const muddle = s.inventory.muddle ?? 0;
    if (muddle <= 0) return;
    const inv = { ...s.inventory };
    delete inv.muddle;
    inv.mote_terra = (inv.mote_terra ?? 0) + muddle;
    set({
      inventory: inv,
      log: pushLog(s, `Composted ${muddle} Muddle into ${muddle} Terra Mote.`, 'info'),
      logSeq: s.logSeq + 1,
    });
  },

  hardReset: () => {
    try { localStorage.removeItem(SAVE_KEY); } catch { /* no storage (e.g. tests) */ }
    set({ ...freshState() });
  },

  applyOffline: () => {
    const s = get();
    const elapsed = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, (Date.now() - s.lastSaved) / 1000));
    if (elapsed < 5) return null;
    const before = { ...s.inventory };
    const beforeCoins = s.coins;
    const next = simulate(s, elapsed, { spawnOrders: false });
    set(next);
    const gains: Record<string, number> = {};
    for (const [key, qty] of Object.entries(next.inventory)) {
      const delta = qty - (before[key] ?? 0);
      if (delta > 0) gains[baseId(key)] = (gains[baseId(key)] ?? 0) + delta; // merge quality stacks
    }
    return { seconds: Math.floor(elapsed), gains, coins: get().coins - beforeCoins };
  },
}));

export function questMetrics(s: GameState): QuestMetrics {
  const did = {} as QuestMetrics['did'];
  let totalLevel = 0;
  for (const k of Object.keys(s.skillXp) as SkillId[]) {
    const lvl = levelForXp(s.skillXp[k]);
    did[k] = s.skillXp[k] > 0;
    totalLevel += lvl;
  }
  return {
    did,
    discovered: s.discovered.length,
    ordersFilled: s.stats.ordersFilled,
    biomes: s.biomes.length,
    perks: s.perks.length,
    totalLevel,
    greatWork: s.greatWork,
  };
}

/** Auto-complete any newly-satisfied onboarding quests and pay their rewards. */
function resolveQuests() {
  const s = useGame.getState();
  const m = questMetrics(s);
  const done = QUESTS.filter((q) => !s.questsClaimed.includes(q.id) && q.check(m));
  if (done.length === 0) return;
  let coins = s.coins;
  const inv = { ...s.inventory };
  let log = s.log;
  let logSeq = s.logSeq;
  for (const q of done) {
    coins += q.reward.coins ?? 0;
    if (q.reward.insight) inv.insight = (inv.insight ?? 0) + q.reward.insight;
    const bits = [q.reward.coins ? `+${q.reward.coins}🪙` : '', q.reward.insight ? `+${q.reward.insight}💡` : ''].filter(Boolean).join(' ');
    const entry: LogEntry = { id: logSeq, text: `✓ ${q.name} — ${bits}`, tone: 'great', at: Math.floor(s.playSeconds) };
    log = [entry, ...log].slice(0, 60);
    logSeq += 1;
  }
  useGame.setState({ coins, inventory: inv, questsClaimed: [...s.questsClaimed, ...done.map((q) => q.id)], log, logSeq });
}

function pushLog(s: GameState, text: string, tone: LogEntry['tone']): LogEntry[] {
  const entry: LogEntry = { id: s.logSeq, text, tone, at: Math.floor(s.playSeconds) };
  return [entry, ...s.log].slice(0, LOG_LIMIT);
}

// ── persistence ──
export function saveGame() {
  const s = useGame.getState();
  const data = {
    version: s.version,
    playSeconds: s.playSeconds,
    lastSaved: Date.now(),
    coins: s.coins,
    reputation: s.reputation,
    inventory: s.inventory,
    skillXp: s.skillXp,
    activeRecipe: s.activeRecipe,
    progress: s.progress,
    lineCap: s.lineCap,
    discovered: s.discovered,
    upgrades: s.upgrades,
    perks: s.perks,
    biomes: s.biomes,
    orders: s.orders,
    nextOrderAt: s.nextOrderAt,
    greatWork: s.greatWork,
    opusComplete: s.opusComplete,
    blooms: s.blooms,
    questsClaimed: s.questsClaimed,
    presets: s.presets,
    stats: s.stats,
    orderSeq: s.orderSeq,
    presetSeq: s.presetSeq,
    logSeq: s.logSeq,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    useGame.setState({ lastSaved: data.lastSaved });
  } catch {
    /* storage full or unavailable — ignore for now */
  }
}

function applyData(data: Record<string, unknown>): boolean {
  if (data.version !== SAVE_VERSION) return false; // future: migrations
  useGame.setState({
    ...freshState(),
    ...data,
    // ensure full skill maps survive shape changes
    skillXp: { ...emptySkillMap(0), ...(data.skillXp as object) },
    activeRecipe: { ...emptySkillMap<string | null>(null), ...(data.activeRecipe as object) },
    progress: { ...emptySkillMap(0), ...(data.progress as object) },
    lineCap: { ...emptySkillMap<number | null>(null), ...(data.lineCap as object) },
    log: [],
  });
  return true;
}

export function loadGame(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    return applyData(JSON.parse(raw));
  } catch {
    return false;
  }
}

/** Export the current save as a portable code (a local stand-in for cloud saves). */
export function exportSave(): string {
  saveGame();
  try {
    return btoa(unescape(encodeURIComponent(localStorage.getItem(SAVE_KEY) ?? '')));
  } catch {
    return '';
  }
}

/** Import a save code produced by exportSave. Returns true on success. */
export function importSave(code: string): boolean {
  try {
    const json = decodeURIComponent(escape(atob(code.trim())));
    const data = JSON.parse(json);
    if (!applyData(data)) return false;
    localStorage.setItem(SAVE_KEY, json);
    return true;
  } catch {
    return false;
  }
}
