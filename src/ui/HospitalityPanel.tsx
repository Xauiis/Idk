import { useGame } from '../game/store';
import { getItem } from '../game/content';

export function HospitalityPanel() {
  const orders = useGame((s) => s.orders);
  const inventory = useGame((s) => s.inventory);
  const fulfill = useGame((s) => s.fulfillOrder);

  if (orders.length === 0) {
    return <div className="empty-note">The shop is quiet for now. New customers wander in every little while — keep your shelves stocked. 🫖</div>;
  }

  return (
    <div className="orders">
      {orders.map((o) => {
        const product = getItem(o.product);
        const have = inventory[o.product] ?? 0;
        const ready = have >= o.qty;
        return (
          <div className="order" key={o.id}>
            <div className="who">
              <span className="av">{o.customerIcon}</span>
              <div>
                <b>{o.customer}</b>
                <div style={{ fontSize: 11, color: 'var(--faint)' }}>wants {o.qty}× {product.name}</div>
              </div>
            </div>
            <div className="story">“{o.story}”</div>
            <div className="want">
              <span className="chip"><span>{product.icon}</span><span>{product.name}</span><span className="q">×{o.qty}</span></span>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: ready ? 'var(--good)' : 'var(--muted)' }}>
                {have}/{o.qty} in stock
              </span>
            </div>
            <div className="reward">
              <span>🪙 <b>{o.coins}</b></span>
              <span>❤ <b>{o.reputation}</b></span>
              <span>🫖 <b>{o.hospitalityXp}</b> xp</span>
            </div>
            <button className="btn btn-good" disabled={!ready} onClick={() => fulfill(o.id)}>
              {ready ? 'Serve customer' : 'Not enough stock'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
