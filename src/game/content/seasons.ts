import type { ProductTree } from '../types';

// A gentle four-season cycle. Each season runs SEASON_LENGTH seconds of play,
// shifts which seasonal ingredients can be gathered, and hosts a little
// festival that pays a bonus on a featured product tree.
export interface SeasonDef {
  index: number;
  name: string;
  icon: string;
  color: string;
  festival: string;
  featuredTree: ProductTree; // orders for this tree pay extra during the season
  blurb: string;
}

export const SEASON_LENGTH = 480; // seconds (~8 minutes) per season
export const FESTIVAL_BONUS = 1.5; // ×coins on featured orders

export const SEASONS: SeasonDef[] = [
  { index: 0, name: 'Spring', icon: '🌷', color: '#8fc77e', festival: 'the Bloomfair', featuredTree: 'feeling', blurb: 'Hearts are light; the town wants bottled feelings.' },
  { index: 1, name: 'Summer', icon: '☀️', color: '#e7c46b', festival: 'the Sun Market', featuredTree: 'material', blurb: 'Traders flock in; charms and treasures sell hot.' },
  { index: 2, name: 'Autumn', icon: '🍂', color: '#d68a4a', festival: 'the Harvest Rest', featuredTree: 'remedy', blurb: 'Aches and sniffles set in; remedies are prized.' },
  { index: 3, name: 'Winter', icon: '❄️', color: '#79c7d9', festival: 'the Long Night', featuredTree: 'feeling', blurb: 'In the dark, folk crave warmth and comfort of the heart.' },
];

export function seasonAt(playSeconds: number): SeasonDef {
  return SEASONS[Math.floor(playSeconds / SEASON_LENGTH) % SEASONS.length];
}

/** Seconds remaining in the current season. */
export function seasonRemaining(playSeconds: number): number {
  return SEASON_LENGTH - (playSeconds % SEASON_LENGTH);
}
