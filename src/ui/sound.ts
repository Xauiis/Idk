// Tiny zero-asset sound layer using the Web Audio API. Soft, cozy chimes for
// the game's happy moments. Respects a persisted on/off setting.
const KEY = 'quintessence.sound';
let enabled = (() => {
  try { return localStorage.getItem(KEY) !== '0'; } catch { return true; }
})();
let ctx: AudioContext | null = null;

export function isSoundOn(): boolean { return enabled; }
export function setSoundOn(on: boolean) {
  enabled = on;
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* ignore */ }
}

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

function tone(freq: number, startAt: number, dur: number, peak: number, type: OscillatorType = 'sine') {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + startAt;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(peak, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** A gentle rising arpeggio for discoveries / completions. */
export function chime() {
  if (!enabled) return;
  const ac = audio();
  if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
  // C5 – E5 – G5, soft and bell-like
  [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.08, 0.5, 0.12, 'triangle'));
}
