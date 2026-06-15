import { useEffect, useRef, useState } from 'react';
import { useGame, saveGame, loadGame } from '../game/store';
import { SKILL_BY_ID } from '../game/content';
import { levelProgress, MAX_LEVEL } from '../game/xp';
import type { SkillId } from '../game/types';
import { SkillRail } from './SkillRail';
import { ProcessPanel } from './ProcessPanel';
import { ConjunctionPanel } from './ConjunctionPanel';
import { HospitalityPanel } from './HospitalityPanel';
import { LorePanel } from './LorePanel';
import { CodexPanel } from './CodexPanel';
import { ShopPanel } from './ShopPanel';
import { Sidebar } from './Sidebar';
import { OfflineModal, type OfflineSummary } from './OfflineModal';

const TICK_MS = 100;

export function App() {
  const [selected, setSelected] = useState<string>('foraging');
  const [offline, setOffline] = useState<OfflineSummary | null>(null);
  const booted = useRef(false);

  // Boot: load save + apply offline progress once.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    loadGame();
    const summary = useGame.getState().applyOffline();
    if (summary) setOffline(summary);
  }, []);

  // Game loop + autosave.
  useEffect(() => {
    let last = performance.now();
    let sinceSave = 0;
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(1.5, (now - last) / 1000);
      last = now;
      useGame.getState().tick(dt);
      sinceSave += dt;
      if (sinceSave >= 5) { saveGame(); sinceSave = 0; }
    }, TICK_MS);

    const onHide = () => { if (document.visibilityState === 'hidden') saveGame(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', saveGame);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', saveGame);
    };
  }, []);

  return (
    <div className="app">
      <TopBar />
      <div className="layout">
        <SkillRail selected={selected} onSelect={setSelected} />
        <main className="card panel">
          {selected === 'codex' ? (
            <CodexPanel />
          ) : selected === 'shop' ? (
            <ShopPanel />
          ) : (
            <>
              <PanelHeader skill={selected as SkillId} />
              {selected === 'conjunction' ? (
                <ConjunctionPanel />
              ) : selected === 'lore' ? (
                <LorePanel />
              ) : selected === 'hospitality' ? (
                <HospitalityPanel />
              ) : (
                <ProcessPanel skill={selected as SkillId} />
              )}
            </>
          )}
        </main>
        <Sidebar />
      </div>
      {offline && <OfflineModal summary={offline} onClose={() => setOffline(null)} />}
    </div>
  );
}

function TopBar() {
  const coins = useGame((s) => s.coins);
  const rep = useGame((s) => s.reputation);
  const insight = useGame((s) => s.inventory.insight ?? 0);
  const hardReset = useGame((s) => s.hardReset);
  return (
    <header className="topbar">
      <div className="brand">
        <div className="mark">⚗️</div>
        <div>
          <h1>Quintessence</h1>
          <div className="sub">a cozy alchemy apothecary</div>
        </div>
      </div>
      <div className="spacer" />
      <div className="stat" title="Coins"><span>🪙</span> {Math.floor(coins)} <small>coins</small></div>
      {insight > 0 && <div className="stat" title="Insight — spend in the Lore research log"><span>💡</span> {Math.floor(insight)} <small>insight</small></div>}
      <div className="stat" title="Reputation in Mirefen"><span>❤</span> {rep} <small>rep</small></div>
      <button
        className="btn btn-ghost"
        title="Erase your save and start over"
        onClick={() => { if (confirm('Start a fresh shop? This erases your current save.')) hardReset(); }}
      >
        ↺ Reset
      </button>
    </header>
  );
}

function PanelHeader({ skill }: { skill: SkillId }) {
  const xp = useGame((s) => s.skillXp[skill]);
  const def = SKILL_BY_ID[skill];
  const { level, pct } = levelProgress(xp);
  return (
    <>
      <div className="panel-head">
        <span className="ic" style={{ background: `color-mix(in srgb, ${def.color} 30%, var(--panel-3))` }}>{def.icon}</span>
        <div>
          <h2>{def.name}</h2>
          <div className="blurb">{def.blurb}</div>
        </div>
        <div className="lvtag">
          <b>{level}</b>
          <small>{level >= MAX_LEVEL ? 'mastered' : `Lv · ${Math.floor(xp).toLocaleString()} xp`}</small>
        </div>
      </div>
      <div className="lvbar"><span style={{ width: `${pct * 100}%` }} /></div>
    </>
  );
}
