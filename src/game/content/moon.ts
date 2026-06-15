// A faster celestial cycle layered under the seasons. The moon turns through
// four phases; each grants a small, themed boon that Astrology lets you read.
export interface MoonPhase {
  index: number;
  name: string;
  icon: string;
  boon: string;
}

export const MOON_LENGTH = 120; // seconds per phase (~8 min full cycle)

export const MOON_PHASES: MoonPhase[] = [
  { index: 0, name: 'New Moon', icon: '🌑', boon: 'Study yields +50% Insight.' },
  { index: 1, name: 'Waxing Moon', icon: '🌓', boon: 'Gathering yields +1 per harvest.' },
  { index: 2, name: 'Full Moon', icon: '🌕', boon: 'Aethercraft channels +1 Aether.' },
  { index: 3, name: 'Waning Moon', icon: '🌗', boon: '+1 quality grade on crafted goods.' },
];

export function moonAt(playSeconds: number): MoonPhase {
  return MOON_PHASES[Math.floor(playSeconds / MOON_LENGTH) % MOON_PHASES.length];
}
