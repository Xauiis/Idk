import { useEffect, useRef, useState } from 'react';
import { useGame } from '../game/store';
import { chime } from './sound';

interface Toast { id: number; text: string }

// Surfaces the game's big moments (discoveries, completed quests, served
// customers, Great Work stages) as transient pop-ups — the discovery-joy layer.
export function Toasts() {
  const log = useGame((s) => s.log);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seen = useRef<number>(-1);

  useEffect(() => {
    // log is newest-first; pick up unseen 'great' entries
    const fresh = log.filter((e) => e.tone === 'great' && e.id > seen.current);
    if (fresh.length === 0) return;
    seen.current = Math.max(seen.current, ...log.map((e) => e.id));
    chime();
    setToasts((cur) => [...cur, ...fresh.map((e) => ({ id: e.id, text: e.text }))].slice(-4));
    const timers = fresh.map((e) =>
      window.setTimeout(() => setToasts((cur) => cur.filter((t) => t.id !== e.id)), 4200),
    );
    return () => timers.forEach(clearTimeout);
  }, [log]);

  if (toasts.length === 0) return null;
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast" onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
