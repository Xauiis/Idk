// A cozy completion log. Each achievement reads a single metric off the game
// state; progress and unlocked-state are computed in the UI (display-only).
export type AchMetric =
  | 'totalLevel' | 'skills99' | 'biomes' | 'discovered' | 'ordersFilled'
  | 'itemsMade' | 'coziness' | 'coins' | 'decorPlaced' | 'perks';

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  metric: AchMetric;
  goal: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_steps', name: 'First Steps', icon: '🌱', metric: 'totalLevel', goal: 50, desc: 'Reach 50 total skill levels.' },
  { id: 'journeyman', name: 'Journeyman Alchemist', icon: '⚗️', metric: 'totalLevel', goal: 300, desc: 'Reach 300 total skill levels.' },
  { id: 'polymath', name: 'Polymath', icon: '🎓', metric: 'totalLevel', goal: 800, desc: 'Reach 800 total skill levels.' },
  { id: 'master', name: 'A True Master', icon: '👑', metric: 'skills99', goal: 1, desc: 'Take any skill to 99.' },
  { id: 'grandmaster', name: 'Grandmaster', icon: '🏅', metric: 'skills99', goal: 5, desc: 'Take five skills to 99.' },
  { id: 'cartographer', name: 'Cartographer', icon: '🗺️', metric: 'biomes', goal: 6, desc: 'Chart every biome.' },
  { id: 'curious', name: 'Curious Mind', icon: '🔍', metric: 'discovered', goal: 14, desc: 'Discover half the combination web.' },
  { id: 'completionist', name: 'The Whole Web', icon: '📖', metric: 'discovered', goal: 28, desc: 'Discover every combination.' },
  { id: 'shopkeep', name: 'Friend of Mirefen', icon: '🫖', metric: 'ordersFilled', goal: 50, desc: 'Fill 50 orders.' },
  { id: 'beloved', name: 'Beloved Apothecary', icon: '💝', metric: 'ordersFilled', goal: 250, desc: 'Fill 250 orders.' },
  { id: 'industrious', name: 'Industrious', icon: '⚙️', metric: 'itemsMade', goal: 5000, desc: 'Craft 5,000 things.' },
  { id: 'homely', name: 'Homely', icon: '🏡', metric: 'coziness', goal: 25, desc: 'Reach 25 Coziness.' },
  { id: 'snug', name: 'Snug as Can Be', icon: '🎀', metric: 'coziness', goal: 50, desc: 'Reach 50 Coziness.' },
  { id: 'wealthy', name: 'Well-to-do', icon: '🪙', metric: 'coins', goal: 10000, desc: 'Hold 10,000 coins at once.' },
  { id: 'scholar', name: 'Scholar', icon: '💡', metric: 'perks', goal: 6, desc: 'Research every breakthrough.' },
];
