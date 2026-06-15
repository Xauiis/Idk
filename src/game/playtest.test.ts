/**
 * Headless playtest: a bot plays the real engine like a player would, and we
 * print a progression report. Run with: npx vitest run playtest
 */
import { describe, it, expect } from 'vitest';
import { useGame } from './store';
import { levelForXp } from './xp';
import { availableRecipes } from './selectors';
import { allLines, itemFlows } from './analytics';
import {
  RECIPES, EXPERIMENT_RECIPES, UPGRADES, PERKS, getItem, LINE_SKILLS,
} from './content';
import { baseId } from './quality';
import type { SkillId } from './types';

const S = () => useGame.getState();
const lvl = (sk: SkillId) => levelForXp(S().skillXp[sk]);
const held = (id: string) => {
  let n = S().inventory[id] ?? 0;
  for (const k in S().inventory) if (k.startsWith(`${id}#`)) n += S().inventory[k];
  return n;
};
const afford = (inputs: { item: string; qty: number }[]) =>
  inputs.every((i) => (S().inventory[i.item] ?? 0) >= i.qty);

let step = 0;
const gatherRecipes = (skill: SkillId) => RECIPES.filter((r) => r.skill === skill && r.inputs.length === 0);
const rot: Record<string, number> = {};
function rotate(skill: SkillId) {
  const opts = gatherRecipes(skill).filter((r) => r.levelReq <= lvl(skill));
  if (opts.length === 0) return;
  // sticky: only switch target when idle, or every ~80s to diversify the mote supply
  if (S().activeRecipe[skill] && step % 20 !== 0) return;
  rot[skill] = (rot[skill] ?? 0) + 1;
  S().setActive(skill, opts[rot[skill] % opts.length].id);
}
/** A line is "fine" if it's running affordably and not over-stocked — don't disturb it (switching resets progress). */
function lineFine(skill: SkillId): boolean {
  const cur = S().activeRecipe[skill];
  if (!cur) return false;
  const recipe = RECIPES.find((r) => r.id === cur);
  if (!recipe) return false;
  if (!afford(recipe.inputs)) return false; // stalled → let it retarget
  const primary = recipe.outputs[0]?.item;
  if (primary && held(primary) >= 12) return false; // plenty on the shelf → diversify
  return true;
}

/** Sticky: keep shelves balanced by making whatever output we hold least of, but only retarget idle/stalled/overstocked lines. */
function leastStocked(skill: SkillId): boolean {
  if (lineFine(skill)) return true;
  const avail = availableRecipes(S(), skill).filter((r) => r.inputs.length > 0);
  const can = avail.filter((r) => afford(r.inputs));
  const pool = can.length ? can : avail; // if nothing affordable, set the cheapest to build toward it
  if (pool.length === 0) return false;
  pool.sort((a, b) => held(a.outputs[0].item) - held(b.outputs[0].item) || a.levelReq - b.levelReq);
  S().setActive(skill, pool[0].id);
  return can.length > 0;
}
function separateMostStocked() {
  if (lineFine('separation')) return; // don't reset a running separation
  const seps = RECIPES.filter((r) => r.skill === 'separation');
  let best: string | null = null, bestStock = 0;
  for (const r of seps) {
    const ing = r.inputs[0].item;
    const stock = S().inventory[ing] ?? 0;
    if (stock > bestStock) { bestStock = stock; best = r.id; }
  }
  if (best) S().setActive('separation', best);
}

function manage() {
  rotate('foraging');
  rotate('gardening');
  // aether: refine if we have a surplus, otherwise channel
  if (held('mote_aether') > 25 && afford([{ item: 'mote_aether', qty: 5 }])) S().setActive('aethercraft', 'refine_quintessence');
  else rotate('aethercraft');
  separateMostStocked();
  leastStocked('glassblowing');
  leastStocked('calcination');
  leastStocked('conjunction');
  leastStocked('distillation');
  leastStocked('transmutation');
  leastStocked('inscription');
  leastStocked('remedycraft');
  leastStocked('feltcraft');
  leastStocked('lore');
}

function tryDiscoveries() {
  let attempts = 0;
  for (const r of EXPERIMENT_RECIPES) {
    if (attempts >= 3) break;
    if (S().discovered.includes(r.id)) continue;
    if (r.levelReq > lvl('conjunction')) continue;
    if (!afford(r.inputs)) continue;
    const map: Record<string, number> = {};
    for (const i of r.inputs) map[i.item] = i.qty;
    S().experiment(map);
    attempts++;
  }
}
function fulfill() {
  for (const o of [...S().orders]) {
    const have = [0, 1, 2, 3].filter((g) => g >= o.minQuality).reduce((s, g) => s + (S().inventory[`${o.product}#${g}`] ?? 0), 0);
    if (have >= o.qty) S().fulfillOrder(o.id);
  }
}
function shop() {
  for (const u of UPGRADES) if (!S().upgrades.includes(u.id) && S().coins >= u.cost * 1.5) S().buyUpgrade(u.id);
  for (const p of PERKS) {
    if (S().perks.includes(p.id)) continue;
    if (p.requires && !S().perks.includes(p.requires)) continue;
    if ((S().inventory.insight ?? 0) >= p.cost) S().buyPerk(p.id);
  }
}

function snapshot(mins: number): string {
  const skills = LINE_SKILLS.map((s) => `${s.slice(0, 4)}${lvl(s)}`).join(' ');
  const prods = Object.entries(S().inventory)
    .filter(([k, q]) => q > 0 && getItem(baseId(k)).kind === 'product')
    .reduce((sum, [, q]) => sum + q, 0);
  return [
    `t=${String(mins).padStart(3)}m`,
    `🪙${String(Math.floor(S().coins)).padStart(6)}`,
    `❤${String(S().reputation).padStart(3)}`,
    `disc ${S().discovered.length}/${EXPERIMENT_RECIPES.length}`,
    `sold ${S().stats.ordersFilled}`,
    `open ${S().orders.length}`,
    `stock ${prods}p`,
    skills,
  ].join('  ');
}

describe('playtest — 90 simulated minutes', () => {
  it('plays the loop end-to-end and progresses', () => {
    S().hardReset();
    const STEP = 4; // seconds of sim per decision
    const TOTAL = 90 * 60;
    const report: string[] = [];
    let firstDiscovery = -1, firstSale = -1, firstFine = -1, firstPure = -1;

    for (let t = 0; t < TOTAL; t += STEP) {
      step++;
      manage();
      tryDiscoveries();
      fulfill();
      shop();
      S().tick(STEP);

      if (firstDiscovery < 0 && S().discovered.length > 0) firstDiscovery = t;
      if (firstSale < 0 && S().stats.ordersFilled > 0) firstSale = t;
      for (const k in S().inventory) {
        if (S().inventory[k] <= 0) continue;
        if (getItem(baseId(k)).kind !== 'product') continue;
        const g = Number(k.split('#')[1] ?? -1);
        if (g >= 1 && firstFine < 0) firstFine = t;
        if (g >= 2 && firstPure < 0) firstPure = t;
      }
      if (t % 600 === 0) report.push(snapshot(t / 60));
    }
    report.push(snapshot(90));

    const flows = itemFlows(S()).slice(0, 6).map((f) => `${getItem(f.item).name} ${f.net > 0 ? '+' : ''}${f.net.toFixed(1)}`);
    const stalled = allLines(S()).filter((l) => l.status === 'stalled').map((l) => `${l.skill}(needs ${l.missing ? getItem(l.missing).name : '?'})`);

    /* eslint-disable no-console */
    console.log('\n================ QUINTESSENCE — 90-MIN PLAYTEST ================');
    for (const r of report) console.log(r);
    console.log('\n--- milestones (game-time) ---');
    console.log(`first discovery : ${firstDiscovery >= 0 ? (firstDiscovery / 60).toFixed(1) + 'm' : 'never'}`);
    console.log(`first sale      : ${firstSale >= 0 ? (firstSale / 60).toFixed(1) + 'm' : 'never'}`);
    console.log(`first Fine good : ${firstFine >= 0 ? (firstFine / 60).toFixed(1) + 'm' : 'never'}`);
    console.log(`first Pure good : ${firstPure >= 0 ? (firstPure / 60).toFixed(1) + 'm' : 'never'}`);
    console.log(`\nflows @90m  : ${flows.join('  |  ')}`);
    console.log(`stalled @90m: ${stalled.length ? stalled.join(', ') : 'none'}`);
    console.log('================================================================\n');
    /* eslint-enable no-console */

    // sanity: the loop actually worked
    expect(S().discovered.length).toBeGreaterThan(5);
    expect(S().stats.ordersFilled).toBeGreaterThan(0);
    expect(S().coins).toBeGreaterThan(25);
    expect(lvl('conjunction')).toBeGreaterThan(5);
  });
});
