import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { CodexPanel } from './CodexPanel';
import { ShopPanel } from './ShopPanel';

describe('UI smoke', () => {
  it('renders the app shell without throwing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Quintessence');
    expect(html).toContain('Foraging');
    expect(html).toContain('Larder');
    expect(html).toContain('Codex');
    expect(html).toContain('Apothecary');
  });

  it('renders the Codex and Shop panels', () => {
    expect(renderToString(<CodexPanel />)).toContain('combinations');
    expect(renderToString(<ShopPanel />)).toContain('Upgrades');
  });
});
