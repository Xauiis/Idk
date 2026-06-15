import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { CodexPanel } from './CodexPanel';
import { ShopPanel } from './ShopPanel';
import { LorePanel } from './LorePanel';
import { LabPanel } from './LabPanel';

describe('UI smoke', () => {
  it('renders the app shell without throwing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Quintessence');
    expect(html).toContain('Foraging');
    expect(html).toContain('Larder');
    expect(html).toContain('Codex');
    expect(html).toContain('Apothecary');
  });

  it('renders the Codex, Shop, Lore and Lab panels', () => {
    expect(renderToString(<CodexPanel />)).toContain('combinations');
    expect(renderToString(<ShopPanel />)).toContain('Upgrades');
    expect(renderToString(<LorePanel />)).toContain('Research Log');
    expect(renderToString(<LabPanel onSelect={() => {}} />)).toContain('The Lab');
  });
});
