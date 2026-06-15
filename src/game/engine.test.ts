import { describe, it, expect, beforeEach } from 'vitest';
import { useGame } from './store';
import { levelForXp, xpForLevel } from './xp';

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
    g.setActive('glassblowing', 'blow_vial'); // 2 terra + 1 ignis → vial, 3s
    useGame.setState({ inventory: { mote_terra: 2, mote_ignis: 1 } });
    g.tick(3);
    expect(useGame.getState().inventory.vial).toBe(1);
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
  it('fulfills an order from stock for coins and reputation', () => {
    useGame.setState({
      inventory: { sleep_tonic: 2 },
      orders: [{
        id: 'o1', customer: 'Test', customerIcon: '🧪', product: 'sleep_tonic',
        qty: 2, coins: 90, reputation: 2, hospitalityXp: 30, story: '', createdAt: 0,
      }],
    });
    useGame.getState().fulfillOrder('o1');
    const s = useGame.getState();
    expect(s.coins).toBe(25 + 90);
    expect(s.reputation).toBe(2);
    expect(s.orders).toHaveLength(0);
    expect(s.inventory.sleep_tonic).toBe(0);
  });
});
