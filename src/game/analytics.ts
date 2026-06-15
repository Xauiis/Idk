// Derived, read-only analytics for the Lab dashboard. Pure functions over game
// state — no mutation. This is the "watch it hum / find the bottleneck" layer.
import { RECIPE_BY_ID, LINE_SKILLS, getItem, speedMultipliers } from './content';
import { baseId } from './quality';
import type { GameState } from './store';
import type { SkillId } from './types';

export type LineStatus = 'idle' | 'running' | 'paused' | 'stalled';

export interface LineInfo {
  skill: SkillId;
  recipeId: string | null;
  recipeName: string | null;
  status: LineStatus;
  missing: string | null; // starved input item id
  primary: string | null; // main output item id
  cap: number | null;
  effDur: number;
  cyclesPerMin: number;
}

function heldBase(inv: Record<string, number>, id: string): number {
  let n = inv[id] ?? 0;
  const prefix = `${id}#`;
  for (const k in inv) if (k.startsWith(prefix)) n += inv[k];
  return n;
}

export function lineInfo(state: GameState, skill: SkillId): LineInfo {
  const recipeId = state.activeRecipe[skill];
  const speed = speedMultipliers(state.upgrades, state.perks)[skill] ?? 1;
  if (!recipeId || !RECIPE_BY_ID[recipeId]) {
    return { skill, recipeId: null, recipeName: null, status: 'idle', missing: null, primary: null, cap: state.lineCap[skill], effDur: 0, cyclesPerMin: 0 };
  }
  const recipe = RECIPE_BY_ID[recipeId];
  const effDur = recipe.duration / speed;
  const primary = recipe.outputs[0]?.item ?? null;
  const cap = state.lineCap[skill];

  let status: LineStatus = 'running';
  let missing: string | null = null;
  if (cap != null && primary && heldBase(state.inventory, primary) >= cap) {
    status = 'paused';
  } else {
    const lack = recipe.inputs.find((i) => (state.inventory[i.item] ?? 0) < i.qty);
    if (lack) { status = 'stalled'; missing = lack.item; }
  }
  return {
    skill, recipeId, recipeName: recipe.name, status, missing, primary, cap,
    effDur, cyclesPerMin: status === 'running' ? 60 / effDur : 0,
  };
}

export function allLines(state: GameState): LineInfo[] {
  return LINE_SKILLS.map((s) => lineInfo(state, s));
}

export interface Flow { item: string; produced: number; consumed: number; net: number }

/** Net per-minute production/consumption across currently running lines. */
export function itemFlows(state: GameState): Flow[] {
  const produced: Record<string, number> = {};
  const consumed: Record<string, number> = {};
  for (const line of allLines(state)) {
    if (line.status !== 'running' || !line.recipeId) continue;
    const recipe = RECIPE_BY_ID[line.recipeId];
    const cpm = line.cyclesPerMin;
    for (const i of recipe.inputs) consumed[baseId(i.item)] = (consumed[baseId(i.item)] ?? 0) + i.qty * cpm;
    for (const o of recipe.outputs) produced[baseId(o.item)] = (produced[baseId(o.item)] ?? 0) + o.qty * cpm;
  }
  const ids = new Set([...Object.keys(produced), ...Object.keys(consumed)]);
  const flows: Flow[] = [];
  for (const item of ids) {
    if (getItem(item).kind === 'product') continue; // products are the goal, not a flow to balance
    const p = produced[item] ?? 0;
    const c = consumed[item] ?? 0;
    flows.push({ item, produced: p, consumed: c, net: p - c });
  }
  return flows.sort((a, b) => a.net - b.net); // most-depleted first
}

export function labSummary(lines: LineInfo[]) {
  return {
    running: lines.filter((l) => l.status === 'running').length,
    stalled: lines.filter((l) => l.status === 'stalled').length,
    paused: lines.filter((l) => l.status === 'paused').length,
    idle: lines.filter((l) => l.status === 'idle').length,
  };
}
