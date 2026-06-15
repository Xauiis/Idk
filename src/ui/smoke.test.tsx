import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { App } from './App';

describe('UI smoke', () => {
  it('renders the app shell without throwing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Quintessence');
    expect(html).toContain('Foraging');
    expect(html).toContain('Larder');
  });
});
