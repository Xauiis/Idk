import { create } from 'zustand';
import type { ElementId, LogEntry, Order, SkillId } from './types';
import { levelForXp } from './xp';
import {
  ELEMENT_BY_ID,
  ORDER_TEMPLATES,
  RECIPE_BY_ID,
  getItem,
  inputSignature,
  EXPERIMENT_RECIPES,
} from './content';

const SAVE_KEY = 'quintessence.save.v1';
const SAVE_VERSION = 1;
const MAX_ORDERS = 5;
const OFFLINE_CAP_SECONDS = 8 * 3600;
const LOG_LIMIT = 60;

// Production flows along this order each tick, so a gather→separate→combine→craft
// chain can move one step within a single tick.
const SKILL_ORDER: SkillId[] = [
  'foraging', 'gardening', 'separation', 'conjunction', 'remedycraft', 'hospitality',
];

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

  discovered: string[]; // discovered conjunction recipe ids
  orders: Order[];
  nextOrderAt: number;

  log: LogEntry[];
  logSeq: number;
  orderSeq: number;

  stats: { itemsMade: number; ordersFilled: number; discoveries: number };

  // ── actions ──
  tick: (dt: number) => void;
  setActive: (skill: SkillId, recipeId: string | null) => void;
  experiment: (motes: Partial<Record<ElementId, number>>) => ExperimentResult;
  fulfillOrder: (orderId: string) => void;
  compostMuddle: () => void;
  hardReset: () => void;
  applyOffline: () => { seconds: number; gains: Record<string, number>; coins: number } | null;
}

export type ExperimentResult =
  | { kind: 'discovered' | 'made'; item: string; name: string }
  | { kind: 'locked'; level: number }
  | { kind: 'muddle' }
  | { kind: 'empty' };

function emptySkillMap<T>(value: T): Record<SkillId, T> {
  return {
    foraging: value, gardening: value, separation: value,
    conjunction: value, remedycraft: value, hospitality: value,
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
    discovered: [] as string[],
    orders: [] as Order[],
    nextOrderAt: 6,
    log: [] as LogEntry[],
    logSeq: 1,
    orderSeq: 1,
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

/** Advance every running line through as many whole cycles as `dt` allows. */
function simulate(state: GameState, dt: number, opts: { spawnOrders: boolean }) {
  const inv = { ...state.inventory };
  const xp = { ...state.skillXp };
  const progress = { ...state.progress };
  let itemsMade = state.stats.itemsMade;

  for (const skill of SKILL_ORDER) {
    const recipeId = state.activeRecipe[skill];
    if (!recipeId) continue;
    const recipe = RECIPE_BY_ID[recipeId];
    if (!recipe) continue;

    let acc = (progress[skill] ?? 0) + dt;
    // Cap runaway accumulation when stalled so the line can't bank infinite time.
    if (acc > recipe.duration * 4) acc = recipe.duration * 4;

    while (acc >= recipe.duration) {
      if (!canAfford(inv, recipe.inputs)) {
        acc = recipe.duration; // hold ready; completes the instant inputs arrive
        break;
      }
      take(inv, recipe.inputs);
      give(inv, recipe.outputs);
      xp[skill] += recipe.xp;
      itemsMade += recipe.outputs.reduce((s, o) => s + o.qty, 0);
      acc -= recipe.duration;
    }
    progress[skill] = acc;
  }

  // Order generation
  let orders = state.orders;
  let nextOrderAt = state.nextOrderAt;
  let orderSeq = state.orderSeq;
  const playSeconds = state.playSeconds + dt;
  if (opts.spawnOrders && playSeconds >= nextOrderAt && orders.length < MAX_ORDERS) {
    const tpl = ORDER_TEMPLATES[Math.floor(Math.random() * ORDER_TEMPLATES.length)];
    const qty = tpl.qtyRange[0] + Math.floor(Math.random() * (tpl.qtyRange[1] - tpl.qtyRange[0] + 1));
    const product = getItem(tpl.product);
    orders = [
      ...orders,
      {
        id: `o${orderSeq}`,
        customer: tpl.customer,
        customerIcon: tpl.customerIcon,
        product: tpl.product,
        qty,
        coins: Math.round(product.value * qty * 1.6),
        reputation: qty,
        hospitalityXp: Math.round(product.value * qty * 0.6),
        story: tpl.story,
        createdAt: Math.floor(playSeconds),
      },
    ];
    orderSeq += 1;
    nextOrderAt = playSeconds + 20 + Math.random() * 25;
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
    const next = simulate(s, dt, { spawnOrders: true });
    set(next);
  },

  setActive: (skill, recipeId) => {
    set((s) => ({
      activeRecipe: { ...s.activeRecipe, [skill]: recipeId },
      progress: { ...s.progress, [skill]: 0 },
    }));
  },

  experiment: (motes) => {
    const s = get();
    const inputs = (Object.entries(motes) as [ElementId, number][])
      .filter(([, q]) => q > 0)
      .map(([el, q]) => ({ item: ELEMENT_BY_ID[el].moteId, qty: q }));
    if (inputs.length === 0) return { kind: 'empty' };

    const inv = { ...s.inventory };
    if (!canAfford(inv, inputs)) return { kind: 'empty' };

    const sig = inputSignature(inputs);
    const match = EXPERIMENT_RECIPES.find((r) => inputSignature(r.inputs) === sig);
    const conjLevel = levelForXp(s.skillXp.conjunction);

    // No match → harmless muddle.
    if (!match) {
      take(inv, inputs);
      give(inv, [{ item: 'muddle', qty: 1 }]);
      set({
        inventory: inv,
        log: pushLog(s, 'That fizzled into a puff of Muddle. Worth a try!', 'muted'),
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
    if ((s.inventory[order.product] ?? 0) < order.qty) return;
    const inv = { ...s.inventory };
    inv[order.product] -= order.qty;
    const xp = { ...s.skillXp };
    xp.hospitality += order.hospitalityXp;
    set({
      inventory: inv,
      coins: s.coins + order.coins,
      reputation: s.reputation + order.reputation,
      skillXp: xp,
      orders: s.orders.filter((o) => o.id !== orderId),
      stats: { ...s.stats, ordersFilled: s.stats.ordersFilled + 1 },
      log: pushLog(s, `${order.customer} is delighted! +${order.coins}🪙 +${order.reputation}❤`, 'great'),
      logSeq: s.logSeq + 1,
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
    for (const [id, qty] of Object.entries(next.inventory)) {
      const delta = qty - (before[id] ?? 0);
      if (delta > 0) gains[id] = delta;
    }
    return { seconds: Math.floor(elapsed), gains, coins: get().coins - beforeCoins };
  },
}));

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
    discovered: s.discovered,
    orders: s.orders,
    nextOrderAt: s.nextOrderAt,
    stats: s.stats,
    orderSeq: s.orderSeq,
    logSeq: s.logSeq,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    useGame.setState({ lastSaved: data.lastSaved });
  } catch {
    /* storage full or unavailable — ignore for now */
  }
}

export function loadGame(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) return false; // future: migrations
    useGame.setState({
      ...freshState(),
      ...data,
      // ensure full skill maps survive shape changes
      skillXp: { ...emptySkillMap(0), ...data.skillXp },
      activeRecipe: { ...emptySkillMap<string | null>(null), ...data.activeRecipe },
      progress: { ...emptySkillMap(0), ...data.progress },
      log: [],
    });
    return true;
  } catch {
    return false;
  }
}
