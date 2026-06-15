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
  { customer: 'Pip the Courier', customerIcon: '🏃', product: 'morning_draught', qtyRange: [2, 4],
    story: 'Long roads before sunup. I need something to shake off the dark.' },
  { customer: 'Scholar Wynn', customerIcon: '🧑‍🎓', product: 'clarity_elixir', qtyRange: [1, 1],
    story: 'My notes blur together past midnight. Could you bottle a little focus?' },
  { customer: 'Ferry the Bridge-builder', customerIcon: '👷', product: 'warming_salve', qtyRange: [2, 3],
    story: 'Cold stone all day. My hands would thank you.' },
  { customer: 'Wren the Bard', customerIcon: '🎻', product: 'sleep_tonic', qtyRange: [1, 2],
    story: 'Stage nerves keep me up. Help me sleep before the spring fair?' },
];
