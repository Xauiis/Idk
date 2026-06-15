// RuneScape-style exponential XP curve. Brisk and cozy early (~83 xp for L2),
// a long completionist tail late (~13M for L99). Shared by every skill.

export const MAX_LEVEL = 99;

function rawLevelXp(level: number): number {
  // Cumulative xp required to *reach* `level`.
  let total = 0;
  for (let n = 1; n < level; n++) {
    total += Math.floor(n + 300 * Math.pow(2, n / 7));
  }
  return Math.floor(total / 4);
}

// Precompute the cumulative table once.
const XP_TABLE: number[] = (() => {
  const table: number[] = [0];
  for (let lvl = 1; lvl <= MAX_LEVEL; lvl++) table[lvl] = rawLevelXp(lvl);
  return table;
})();

/** Total xp needed to reach a given level. */
export function xpForLevel(level: number): number {
  const clamped = Math.max(1, Math.min(MAX_LEVEL, level));
  return XP_TABLE[clamped];
}

/** Current level for a given total xp. */
export function levelForXp(xp: number): number {
  let level = 1;
  while (level < MAX_LEVEL && XP_TABLE[level + 1] <= xp) level++;
  return level;
}

/** Progress (0..1) through the current level toward the next. */
export function levelProgress(xp: number): { level: number; pct: number; into: number; span: number } {
  const level = levelForXp(xp);
  if (level >= MAX_LEVEL) return { level, pct: 1, into: 0, span: 0 };
  const base = XP_TABLE[level];
  const next = XP_TABLE[level + 1];
  const span = next - base;
  const into = xp - base;
  return { level, pct: span > 0 ? into / span : 0, into, span };
}
