// Templates the town draws on to generate orders. Each fulfilled order is a
// little story — the warm heart of the cozy loop.

export interface OrderTemplate {
  customer: string;
  customerIcon: string;
  product: string;
  qtyRange: [number, number];
  minQuality?: number; // 0..3 — the lowest grade this customer will accept
  story: string;
}

export const ORDER_TEMPLATES: OrderTemplate[] = [
  { customer: 'Bramble the Baker', customerIcon: '🧑‍🍳', product: 'sleep_tonic', qtyRange: [1, 3],
    story: 'The ovens run all night and so does my mind. Something to help me rest?' },
  { customer: 'Old Maren', customerIcon: '👵', product: 'warming_salve', qtyRange: [1, 2],
    story: 'My knees ache when the fog rolls in. A warming salve would be a kindness.' },
  { customer: 'Sunny the Gardener', customerIcon: '🧑‍🌾', product: 'dewdrop_balm', qtyRange: [1, 3],
    story: 'Caught too much sun in the rows again. Have you anything cooling?' },
  { customer: 'Pip the Courier', customerIcon: '🏃', product: 'morning_draught', qtyRange: [2, 4],
    story: 'Long roads before sunup. I need something to shake off the dark.' },
  { customer: 'Scholar Wynn', customerIcon: '🧑‍🎓', product: 'bright_eye_drops', qtyRange: [1, 2],
    story: 'The small print swims past midnight. Could you sharpen my eyes?' },
  { customer: 'Ferry the Bridge-builder', customerIcon: '👷', product: 'courage_cordial', qtyRange: [1, 2],
    story: 'They want me to cross the high span tomorrow. I could use some spine.' },
  { customer: 'Wren the Bard', customerIcon: '🎻', product: 'clarity_elixir', qtyRange: [1, 1],
    story: 'My new ballad is a tangle. Help me see it clearly?' },
  { customer: 'Little Tam', customerIcon: '🧒', product: 'dreamless_philtre', qtyRange: [1, 1],
    story: 'Tam has bad dreams every night. Please — something gentle?' },
  { customer: 'Captain Hollis', customerIcon: '🧑‍✈️', product: 'sunforge_potion', qtyRange: [1, 1],
    story: 'We sail into the grey at dawn. I want a little daylight in a bottle.' },
  { customer: 'The Grey Pilgrim', customerIcon: '🧙', product: 'panacea', qtyRange: [1, 1],
    story: 'I have walked far and ache all over. They say you are nearly a master now…' },
  // Phase 2: distillate remedies & luxury goods, some with quality demands
  { customer: 'Lady Vesper', customerIcon: '👩‍🦳', product: 'tranquil_balm', qtyRange: [1, 2], minQuality: 1,
    story: 'Court is exhausting. I shall only take the Fine grade or better, naturally.' },
  { customer: 'Sister Lune', customerIcon: '🧝', product: 'dawnlight_tonic', qtyRange: [1, 1], minQuality: 2,
    story: 'For the dawn vigil — it must be Pure, nothing less will do.' },
  { customer: 'Merchant Cole', customerIcon: '🧔', product: 'brass_charm', qtyRange: [2, 4],
    story: 'Charms sell well at the fair. Send me whatever you can spare!' },
  { customer: 'Goodwife Plum', customerIcon: '👩', product: 'dreamsilk_sachet', qtyRange: [1, 2],
    story: 'A little something to tuck under the children’s pillows.' },
  { customer: 'Collector Vance', customerIcon: '🤵', product: 'lens_ornament', qtyRange: [1, 1], minQuality: 2,
    story: 'I display only the Pure. A flawed ornament would shame my cabinet.' },
  { customer: 'The Archcountess', customerIcon: '👸', product: 'aether_signet', qtyRange: [1, 1], minQuality: 3,
    story: 'A signet for my heir. It must be Pristine — utterly perfect.' },
  // Phase 3: Bottled Feelings — little emotional-need stories
  { customer: 'Trembling Edda', customerIcon: '🙍‍♀️', product: 'feeling_calm', qtyRange: [1, 3],
    story: 'My hands won’t stop shaking before market day. Could you bottle a little calm for me?' },
  { customer: 'Young Rook', customerIcon: '🧑', product: 'feeling_courage', qtyRange: [1, 2],
    story: 'I mean to ask Wyn to dance at the fair. I… I need to be braver than I am.' },
  { customer: 'Apprentice Fen', customerIcon: '🧑‍🔧', product: 'feeling_focus', qtyRange: [1, 2], minQuality: 1,
    story: 'My mind wanders at the bench all day. Something to help me concentrate?' },
  { customer: 'Widow Ash', customerIcon: '🧓', product: 'feeling_nostalgia', qtyRange: [1, 1], minQuality: 1,
    story: 'I miss my late husband terribly. Just one evening of the old days… is that so much?' },
  { customer: 'Stargazer Io', customerIcon: '🔭', product: 'feeling_wonder', qtyRange: [1, 1], minQuality: 2,
    story: 'I have grown numb to the night sky. Help me feel the awe again — and make it Pure.' },
  { customer: 'Festival Steward', customerIcon: '🎭', product: 'feeling_euphoria', qtyRange: [1, 1], minQuality: 2,
    story: 'The Midsummer crowd deserves a moment of pure joy. Only your finest will do.' },
  // A few more familiar faces around Mirefen
  { customer: 'Tinker Bex', customerIcon: '🧑‍🔧', product: 'morning_draught', qtyRange: [1, 3],
    story: 'Up before the cockerel to mend the mill. A draught to start the day?' },
  { customer: 'Granny Sloe', customerIcon: '👵', product: 'dewdrop_balm', qtyRange: [1, 2],
    story: 'This sun is unkind to old skin. A dab of something cool, dear?' },
  { customer: 'The Lamplighter', customerIcon: '🪔', product: 'feeling_focus', qtyRange: [1, 2], minQuality: 1,
    story: 'A hundred wicks to light before dusk, and my mind keeps drifting.' },
  { customer: 'Marsh-guide Ren', customerIcon: '🧭', product: 'warming_salve', qtyRange: [2, 3],
    story: 'Knee-deep in cold reeds all day leading travellers. My joints are pleading.' },
  { customer: 'Twins Mae & Mo', customerIcon: '👧', product: 'sleep_tonic', qtyRange: [2, 2],
    story: 'Two of us, one bedtime, no sleeping. Mother begs you for help!' },
  { customer: 'Hollow the Hermit', customerIcon: '🧓', product: 'clarity_elixir', qtyRange: [1, 1], minQuality: 1,
    story: 'I have a riddle I have chewed for thirty years. Lend me a clear hour?' },
  { customer: 'Brewer Cask', customerIcon: '🍺', product: 'feeling_courage', qtyRange: [1, 2],
    story: 'Telling the guild my ale is the best in three counties takes some nerve.' },
];
