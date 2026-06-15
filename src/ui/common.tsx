import { getItem } from '../game/content';

/** Compact number formatting: exact under 10k, then 12.3k / 4.5m. */
export function fmtNum(n: number): string {
  const v = Math.floor(n);
  if (v < 10000) return v.toLocaleString();
  if (v < 1_000_000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return (v / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'm';
}

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
