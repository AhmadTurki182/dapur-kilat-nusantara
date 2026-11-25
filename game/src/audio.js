// Dapur Kilat Nusantara — suara WebAudio, tanpa file eksternal.
// Semua bunyi disintesis dari oscillator + noise buffer.

let ctx = null;
let muted = false;
let sizzleNode = null;

export function setMuted(m) {
  muted = m;
  if (muted) stopSizzle();
}

export function isMuted() {
  return muted;
}

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, vol, when = 0, slideTo = 0) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

export function sfxClick() {
  tone(620, 0.07, 'triangle', 0.12, 0, 880);
}

export function sfxAdd() {
  tone(440, 0.08, 'sine', 0.14, 0, 660);
  tone(880, 0.06, 'sine', 0.07, 0.05);
}

export function sfxTrash() {
  tone(300, 0.16, 'sawtooth', 0.08, 0, 90);
}

export function sfxError() {
  tone(160, 0.18, 'square', 0.09, 0, 110);
}

export function sfxDing() {
  tone(1046, 0.16, 'sine', 0.16);
  tone(1318, 0.22, 'sine', 0.16, 0.09);
  tone(1568, 0.3, 'sine', 0.12, 0.18);
}

export function sfxPerfect() {
  tone(784, 0.1, 'triangle', 0.14);
  tone(988, 0.1, 'triangle', 0.14, 0.08);
  tone(1175, 0.14, 'triangle', 0.14, 0.16);
  tone(1568, 0.26, 'triangle', 0.16, 0.24);
}

export function sfxFail() {
  tone(392, 0.2, 'sawtooth', 0.08, 0, 330);
  tone(311, 0.28, 'sawtooth', 0.08, 0.16, 233);
}

export function sfxNewOrder() {
  tone(523, 0.09, 'triangle', 0.1);
  tone(659, 0.12, 'triangle', 0.1, 0.08);
}

export function sfxLevelUp() {
  tone(523, 0.1, 'triangle', 0.13);
  tone(659, 0.1, 'triangle', 0.13, 0.09);
  tone(784, 0.16, 'triangle', 0.15, 0.18);
  tone(1046, 0.24, 'triangle', 0.15, 0.27);
}

export function startSizzle() {
  if (muted) return;
  const c = ac();
  if (!c || sizzleNode) return;
  const len = c.sampleRate * 1;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = 5200;
  f.Q.value = 0.6;
  const g = c.createGain();
  g.gain.value = 0.05;
  src.connect(f).connect(g).connect(c.destination);
  src.start();
  sizzleNode = { src, g };
}

export function stopSizzle() {
  if (!sizzleNode) return;
  try {
    sizzleNode.g.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    sizzleNode.src.stop(ctx.currentTime + 0.3);
  } catch (e) { /* sudah berhenti */ }
  sizzleNode = null;
}
