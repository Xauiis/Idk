// Templates the town draws on to generate orders. Each fulfilled order is a
// little story — the warm heart of the cozy loop.

export interface OrderTemplate {
  customer: string;
  customerIcon: string;
  product: string;
  qtyRange: [number, number];
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
];
