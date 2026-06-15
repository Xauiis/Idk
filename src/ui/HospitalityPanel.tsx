import { useGame } from '../game/store';
import { getItem } from '../game/content';
import { pkey, quality } from '../game/quality';
import { fmtTime } from './common';

export function HospitalityPanel() {
  const orders = useGame((s) => s.orders);
  const inventory = useGame((s) => s.inventory);
  const playSeconds = useGame((s) => s.playSeconds);
  const fulfill = useGame((s) => s.fulfillOrder);
  const decline = useGame((s) => s.declineOrder);

  if (orders.length === 0) {
    return <div className="empty-note">The shop is quiet for now. New customers wander in every little while — keep your shelves stocked. 🫖</div>;
  }

  return (
    <div className="orders">
      {orders.map((o) => {
        const product = getItem(o.product);
        // count stock at or above the required grade
        const have = [0, 1, 2, 3]
          .filter((g) => g >= o.minQuality)
          .reduce((sum, g) => sum + (inventory[pkey(o.product, g)] ?? 0), 0);
        const ready = have >= o.qty;
        const minQ = quality(o.minQuality);
        return (
          <div className="order" key={o.id}>
            <div className="who">
              <span className="av">{o.customerIcon}</span>
              <div>
                <b>{o.customer}</b>
                <div style={{ fontSize: 11, color: 'var(--faint)' }}>wants {o.qty}× {product.name}</div>
              </div>
              <button
                className="order-decline"
                title="Send this customer away"
                onClick={() => decline(o.id)}
              >✕</button>
            </div>
            <div className="story">“{o.story}”</div>
            <div className="want">
              <span className="chip"><span>{product.icon}</span><span>{product.name}</span><span className="q">×{o.qty}</span></span>
              {o.minQuality > 0 && (
                <span className="chip" style={{ borderColor: minQ.color }} title={`Requires ${minQ.name} grade or better`}>
                  <span style={{ color: minQ.color }}>{minQ.short}</span><span>{minQ.name}+</span>
                </span>
              )}
              <span style={{ marginLeft: 'auto', fontSize: 12, color: ready ? 'var(--good)' : 'var(--muted)' }}>
                {have}/{o.qty} eligible
              </span>
            </div>
            <div className="reward">
              <span>🪙 <b>~{o.coins}</b></span>
              <span>❤ <b>{o.reputation}</b></span>
              <span>🫖 <b>{o.hospitalityXp}</b> xp</span>
              <span style={{ marginLeft: 'auto', color: 'var(--faint)' }} title="The customer wanders off when this runs out (no penalty)">
                ⏳ {fmtTime(Math.max(0, o.expiresAt - playSeconds))}
              </span>
            </div>
            <button className="btn btn-good" disabled={!ready} onClick={() => fulfill(o.id)}>
              {ready ? 'Serve customer' : o.minQuality > 0 ? `Need ${o.qty}× ${minQ.name}+` : 'Not enough stock'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
