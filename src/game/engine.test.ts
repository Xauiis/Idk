import { describe, it, expect, beforeEach } from 'vitest';
import { useGame, maxOrders } from './store';
import { levelForXp, xpForLevel } from './xp';
import { lineInfo, itemFlows } from './analytics';
import { availableRecipes, inSeason } from './selectors';
import { RECIPE_BY_ID, seasonAt, SEASON_LENGTH } from './content';

beforeEach(() => {
  useGame.getState().hardReset();
});

describe('xp curve', () => {
  it('matches the RuneScape table at key levels', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(83);
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(82)).toBe(1);
    expect(levelForXp(83)).toBe(2);
    expect(xpForLevel(99)).toBeGreaterThan(13_000_000);
  });
});

describe('production lines', () => {
  it('gathers an ingredient over time and grants xp', () => {
    const g = useGame.getState();
    g.setActive('foraging', 'forage_lavender'); // 3s, 8xp, → 1 lavender
    g.tick(3);
    const s = useGame.getState();
    expect(s.inventory.lavender).toBe(1);
    expect(s.skillXp.foraging).toBe(8);
  });

  it('runs a gather→separate chain within ticks and stalls without inputs', () => {
    const g = useGame.getState();
    g.setActive('separation', 'separate_lavender'); // needs lavender
    g.tick(10);
    // No lavender yet → no motes, line is stalled.
    expect(useGame.getState().inventory.mote_aer ?? 0).toBe(0);

    useGame.setState({ inventory: { lavender: 1 } });
    g.tick(3); // separation duration ~2.9s → one cycle
    const inv = useGame.getState().inventory;
    expect(inv.mote_aer).toBe(3);
    expect(inv.mote_aqua).toBe(2);
    expect(inv.mote_aether).toBe(1);
    expect(inv.lavender).toBe(0);
  });
});

describe('discovery via experiment', () => {
  it('discovers Steam Essence from Ignis + Aqua and consumes motes', () => {
    useGame.setState({ inventory: { mote_ignis: 1, mote_aqua: 1 } });
    const res = useGame.getState().experiment({ mote_ignis: 1, mote_aqua: 1 });
    expect(res.kind).toBe('discovered');
    const s = useGame.getState();
    expect(s.inventory.steam_essence).toBe(1);
    expect(s.inventory.mote_ignis ?? 0).toBe(0);
    expect(s.discovered).toContain('conj_steam_essence');
  });

  it('discovers a compound from two essences', () => {
    useGame.setState({ inventory: { steam_essence: 1, ember_essence: 1 }, skillXp: { ...useGame.getState().skillXp, conjunction: 5000 } });
    const res = useGame.getState().experiment({ steam_essence: 1, ember_essence: 1 });
    expect(res.kind).toBe('discovered');
    expect(useGame.getState().inventory.geyser_tincture).toBe(1);
  });

  it('produces muddle on an invalid combination', () => {
    useGame.setState({ inventory: { mote_terra: 1 } });
    const res = useGame.getState().experiment({ mote_terra: 1 });
    expect(res.kind).toBe('muddle');
    expect(useGame.getState().inventory.muddle).toBe(1);
  });
});

describe('glassblowing & upgrades', () => {
  it('blows a vial from terra + ignis motes', () => {
    const g = useGame.getState();
    g.setActive('glassblowing', 'blow_vial'); // 2 terra + 1 ignis → 2 vials, 3s
    useGame.setState({ inventory: { mote_terra: 2, mote_ignis: 1 } });
    g.tick(3);
    expect(useGame.getState().inventory.vial).toBe(2);
  });

  it('an upgrade speeds up a line so more cycles complete per second', () => {
    const g = useGame.getState();
    g.setActive('foraging', 'forage_lavender'); // base 3s
    useGame.setState({ coins: 1000 });
    g.buyUpgrade('whittled_basket'); // foraging ×1.2 → eff 2.5s
    g.tick(3);
    // With 3s at eff 2.5s, one full cycle completes (1.2 partial) → exactly 1 lavender.
    expect(useGame.getState().inventory.lavender).toBe(1);
    expect(useGame.getState().coins).toBe(1000 - 60);
  });
});

describe('orders', () => {
  it('fulfills an order from Fine stock for the base reward', () => {
    useGame.setState({
      inventory: { 'sleep_tonic#1': 2 }, // 2 Fine tonics
      orders: [{
        id: 'o1', customer: 'Test', customerIcon: '🧪', product: 'sleep_tonic',
        qty: 2, minQuality: 0, coins: 90, reputation: 2, hospitalityXp: 30, story: '', createdAt: 0, expiresAt: 1e9, featured: false,
      }],
    });
    useGame.getState().fulfillOrder('o1');
    const s = useGame.getState();
    expect(s.coins).toBe(25 + 90); // Fine → ×1.0
    expect(s.orders).toHaveLength(0);
    expect(s.inventory['sleep_tonic#1'] ?? 0).toBe(0);
  });

  it('scales the reward by delivered quality and respects min-quality', () => {
    useGame.setState({
      inventory: { 'aether_signet#3': 1, 'aether_signet#1': 5 },
      orders: [{
        id: 'o2', customer: 'Countess', customerIcon: '👸', product: 'aether_signet',
        qty: 1, minQuality: 3, coins: 100, reputation: 1, hospitalityXp: 10, story: '', createdAt: 0, expiresAt: 1e9, featured: false,
      }],
    });
    useGame.getState().fulfillOrder('o2');
    const s = useGame.getState();
    expect(s.coins).toBe(25 + 180); // Pristine → ×1.8
    expect(s.inventory['aether_signet#3'] ?? 0).toBe(0);
    expect(s.inventory['aether_signet#1']).toBe(5); // Fine stock untouched (below min)
  });
});

describe('phase 2 systems', () => {
  it('crafts products at a quality grade that rises with skill level', () => {
    const g = useGame.getState();
    g.setActive('remedycraft', 'craft_sleep_tonic'); // L1 recipe
    useGame.setState({ inventory: { calm_essence: 99, vial: 99 }, skillXp: { ...g.skillXp, remedycraft: 0 } });
    g.tick(4);
    expect(useGame.getState().inventory['sleep_tonic#0']).toBe(1); // low level → Crude
  });

  it('Study yields Insight and a perk can be researched and refunds nothing extra', () => {
    const g = useGame.getState();
    useGame.setState({ inventory: { insight: 25 } });
    g.buyPerk('keen_study'); // costs 20
    const s = useGame.getState();
    expect(s.perks).toContain('keen_study');
    expect(s.inventory.insight).toBe(5);
  });

  it('Calcination → Transmutation produces a material', () => {
    const g = useGame.getState();
    g.setActive('transmutation', 'trans_living_brass'); // 3 iron_salt + 1 ember_essence
    useGame.setState({ inventory: { iron_salt: 9, ember_essence: 3 } });
    g.tick(4);
    expect(useGame.getState().inventory.living_brass).toBe(1);
  });
});

describe('phase 3 systems', () => {
  it('Aethercraft channels raw Aether from nothing over time', () => {
    const g = useGame.getState();
    g.setActive('aethercraft', 'channel_ley'); // → 1 aether mote, 5s
    g.tick(5);
    expect(useGame.getState().inventory.mote_aether).toBe(1);
  });

  it('Feltcraft bottles a feeling, consuming Aether (the bottleneck)', () => {
    const g = useGame.getState();
    g.setActive('feltcraft', 'felt_calm'); // calm_essence + 2 aether + vial → feeling_calm
    useGame.setState({ inventory: { calm_essence: 1, mote_aether: 2, vial: 1 } });
    g.tick(5);
    const inv = useGame.getState().inventory;
    expect(inv['feeling_calm#0']).toBe(1); // product carries a quality grade
    expect(inv.mote_aether ?? 0).toBe(0); // Aether was spent
  });

  it('a line cap pauses production once the shelf is full', () => {
    const g = useGame.getState();
    g.setActive('aethercraft', 'channel_ley');
    g.setLineCap('aethercraft', 2);
    g.tick(30); // would make ~6 without a cap
    expect(useGame.getState().inventory.mote_aether).toBe(2);
  });

  it('Inscription etches a sigil from salt + Aether', () => {
    const g = useGame.getState();
    g.setActive('inscription', 'inscribe_lesser'); // white_salt + 2 aether → lesser_sigil
    useGame.setState({ inventory: { white_salt: 1, mote_aether: 2 } });
    g.tick(5);
    expect(useGame.getState().inventory.lesser_sigil).toBe(1);
  });
});

describe('phase 5 — world & seasons', () => {
  it('gates gathering behind charted biomes', () => {
    // Whispering Caves (Prospecting) starts locked.
    expect(availableRecipes(useGame.getState(), 'prospecting').some((r) => r.id === 'mine_quartz')).toBe(false);
    useGame.setState({ coins: 500, reputation: 0 });
    useGame.getState().unlockBiome('caves'); // cost 180, repReq 0
    expect(useGame.getState().biomes).toContain('caves');
    expect(useGame.getState().coins).toBe(320);
    expect(availableRecipes(useGame.getState(), 'prospecting').some((r) => r.id === 'mine_quartz')).toBe(true);
  });

  it('refuses a biome without enough reputation', () => {
    useGame.setState({ coins: 9999, reputation: 0 });
    useGame.getState().unlockBiome('grove'); // needs rep 30
    expect(useGame.getState().biomes).not.toContain('grove');
  });

  it('makes seasonal gatherables in/out of season', () => {
    const sunpetal = RECIPE_BY_ID.grow_sunpetal; // seasons [0,1] = Spring/Summer
    useGame.setState({ playSeconds: 0 }); // Spring
    expect(seasonAt(0).name).toBe('Spring');
    expect(inSeason(useGame.getState(), sunpetal)).toBe(true);
    useGame.setState({ playSeconds: SEASON_LENGTH * 3 }); // Winter
    expect(inSeason(useGame.getState(), sunpetal)).toBe(false);
  });

  it('grows the order book with reputation', () => {
    expect(maxOrders(0)).toBe(5);
    expect(maxOrders(120)).toBe(8);
    expect(maxOrders(999)).toBe(10);
  });
});

describe('phase 4 — the lab', () => {
  it('reports line status: running, stalled, paused', () => {
    const g = useGame.getState();
    g.setActive('foraging', 'forage_lavender'); // no inputs → running
    expect(lineInfo(useGame.getState(), 'foraging').status).toBe('running');

    g.setActive('separation', 'separate_lavender'); // needs lavender (none) → stalled
    const sep = lineInfo(useGame.getState(), 'separation');
    expect(sep.status).toBe('stalled');
    expect(sep.missing).toBe('lavender');

    g.setActive('aethercraft', 'channel_ley');
    g.setLineCap('aethercraft', 2);
    useGame.setState({ inventory: { ...useGame.getState().inventory, mote_aether: 5 } });
    expect(lineInfo(useGame.getState(), 'aethercraft').status).toBe('paused');
  });

  it('computes net resource flow for running lines', () => {
    const g = useGame.getState();
    g.setActive('foraging', 'forage_lavender'); // 3s → +1 lavender per cycle
    const flow = itemFlows(useGame.getState()).find((f) => f.item === 'lavender');
    expect(flow).toBeDefined();
    expect(flow!.net).toBeGreaterThan(0);
  });

  it('saves and re-applies a line preset, and stops all lines', () => {
    const g = useGame.getState();
    g.setActive('foraging', 'forage_lavender');
    g.setActive('gardening', 'grow_ironroot');
    g.savePreset('My Setup');
    g.stopAllLines();
    expect(useGame.getState().activeRecipe.foraging).toBeNull();

    const id = useGame.getState().presets[0].id;
    useGame.getState().applyPreset(id);
    const a = useGame.getState().activeRecipe;
    expect(a.foraging).toBe('forage_lavender');
    expect(a.gardening).toBe('grow_ironroot');
  });
});
