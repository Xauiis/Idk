import type { ElementDef } from '../types';

// The five elements. The first four are common; Aether is the rare quintessence
// that gates the deeper content (and gives the game its name).
export const ELEMENTS: ElementDef[] = [
  { id: 'terra', name: 'Terra', glyph: '🜃', color: '#a9794e', moteId: 'mote_terra', blurb: 'Body, salt, root and stone.' },
  { id: 'aqua', name: 'Aqua', glyph: '🜄', color: '#4f9dd1', moteId: 'mote_aqua', blurb: 'Flow, sap, solvent and tear.' },
  { id: 'ignis', name: 'Ignis', glyph: '🜂', color: '#d9663f', moteId: 'mote_ignis', blurb: 'Heat, spice and transformation.' },
  { id: 'aer', name: 'Aer', glyph: '🜁', color: '#8fbf8a', moteId: 'mote_aer', blurb: 'Spirit, scent, vapour and breath.' },
  { id: 'aether', name: 'Aether', glyph: '✦', color: '#c08ae0', moteId: 'mote_aether', blurb: 'The quintessence — wonder, light and binding.' },
];

export const ELEMENT_BY_ID: Record<string, ElementDef> = Object.fromEntries(
  ELEMENTS.map((e) => [e.id, e]),
);
