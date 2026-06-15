import { getItem } from '../game/content';
import { fmtTime } from './common';

export interface OfflineSummary {
  seconds: number;
  gains: Record<string, number>;
  coins: number;
}

export function OfflineModal({ summary, onClose }: { summary: OfflineSummary; onClose: () => void }) {
  const gains = Object.entries(summary.gains).filter(([, q]) => q > 0);
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 40 }}>🌙</div>
        <h2>Welcome back</h2>
        <p>The lab kept gently simmering for <b>{fmtTime(summary.seconds)}</b> while you were away.</p>
        {gains.length > 0 ? (
          <div className="gains">
            {gains.map(([id, q]) => (
              <span className="chip" key={id}><span>{getItem(id).icon}</span><span>{getItem(id).name}</span><span className="q">×{Math.floor(q)}</span></span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--faint)' }}>Nothing was brewing — set some lines running before you go!</p>
        )}
        <button className="btn btn-primary" onClick={onClose}>Lovely ✦</button>
      </div>
    </div>
  );
}
