import { getItem } from '../game/content';

export function fmtTime(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function Chip({ item, qty }: { item: string; qty: number }) {
  const it = getItem(item);
  return (
    <span className="chip" title={it.blurb ?? it.name}>
      <span>{it.icon}</span>
      <span>{it.name}</span>
      {qty > 1 && <span className="q">×{qty}</span>}
    </span>
  );
}

export function ItemIO({ inputs, outputs }: { inputs: { item: string; qty: number }[]; outputs: { item: string; qty: number }[] }) {
  return (
    <div className="io">
      {inputs.length === 0 ? (
        <span style={{ color: 'var(--faint)' }}>from the wild</span>
      ) : (
        inputs.map((i) => <Chip key={i.item} item={i.item} qty={i.qty} />)
      )}
      <span className="arrow">→</span>
      {outputs.map((o) => <Chip key={o.item} item={o.item} qty={o.qty} />)}
    </div>
  );
}
