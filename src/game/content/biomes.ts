// Biomes you chart and unlock to widen your ingredient pool. The Commons is
// free from the start; the rest cost coins (an "expedition") and some ask for a
// little standing in town first.
export interface BiomeDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  cost: number; // coins to chart
  repReq: number; // reputation required
  blurb: string;
}

export const BIOMES: BiomeDef[] = [
  { id: 'commons', name: 'Mirefen Commons', icon: '🏡', color: '#86c07c', cost: 0, repReq: 0, blurb: 'The hedgerows and plots around your shop. Always open.' },
  { id: 'caves', name: 'Whispering Caves', icon: '🕳️', color: '#9a8f6f', cost: 180, repReq: 0, blurb: 'Damp tunnels rich in salt, quartz and emberstone. Home of Prospecting.' },
  { id: 'coast', name: 'Saltmarsh Coast', icon: '🌊', color: '#5aa9dd', cost: 380, repReq: 8, blurb: 'Tide-pools and reed-beds full of water reagents. Home of Tidewalking.' },
  { id: 'meadows', name: 'Sunpetal Meadows', icon: '🌻', color: '#e6cf6a', cost: 520, repReq: 14, blurb: 'Sun-warmed fields for the choicer garden crops.' },
  { id: 'grove', name: 'Moonlit Grove', icon: '🌙', color: '#9b7ad0', cost: 900, repReq: 30, blurb: 'A hush of silver trees where Aether-rich flora bloom by night.' },
  { id: 'emberpeak', name: 'Emberpeak Slopes', icon: '🌋', color: '#e2754a', cost: 1500, repReq: 55, blurb: 'Warm volcanic terraces where fiery mushrooms and thorns thrive.' },
];

export const BIOME_BY_ID: Record<string, BiomeDef> = Object.fromEntries(BIOMES.map((b) => [b.id, b]));
