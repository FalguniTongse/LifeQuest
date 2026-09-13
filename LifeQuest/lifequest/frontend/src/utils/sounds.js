/**
 * LifeQuest sound engine — Spider-Man theme.
 *
 * All effects are synthesized in-browser with the Web Audio API, so there
 * are no binary audio files to ship, license, or download. Mute state is
 * persisted to localStorage and read by the Sidebar's audio toggle.
 */

const STORAGE_KEY = 'lifequest-audio-enabled';

let ctx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function isAudioEnabled() {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === 'true';
}

export function setAudioEnabled(enabled) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('lifequest-audio-change', { detail: enabled }));
}

function tone(audioCtx, { freq, start, duration, type = 'sine', gain = 0.2, freqEnd = null }) {
  const osc = audioCtx.createOscillator();
  const amp = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd !== null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), start + duration);
  }
  amp.gain.setValueAtTime(0, start);
  amp.gain.linearRampToValueAtTime(gain, start + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp);
  amp.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noiseBurst(audioCtx, { start, duration, gain = 0.15, filterFreqStart = 4000, filterFreqEnd = 800 }) {
  const bufferSize = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreqStart, start);
  filter.frequency.exponentialRampToValueAtTime(Math.max(filterFreqEnd, 1), start + duration);
  filter.Q.value = 1.2;

  const amp = audioCtx.createGain();
  amp.gain.setValueAtTime(0, start);
  amp.gain.linearRampToValueAtTime(gain, start + 0.005);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  noise.connect(filter);
  filter.connect(amp);
  amp.connect(audioCtx.destination);
  noise.start(start);
  noise.stop(start + duration + 0.02);
}

function play(effect) {
  if (!isAudioEnabled()) return;
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    effect(audioCtx);
  } catch {
    // Audio is a nice-to-have; never let it break the app.
  }
}

/** Quick web-shooter "thwip" — used on quest completion. */
export function playThwip() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    noiseBurst(audioCtx, { start: now, duration: 0.14, gain: 0.18, filterFreqStart: 5200, filterFreqEnd: 1200 });
    tone(audioCtx, { freq: 900, freqEnd: 260, start: now, duration: 0.13, type: 'sawtooth', gain: 0.1 });
  });
}

/** Short spidey-sense chime — used on achievement unlock. */
export function playAchievement() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    tone(audioCtx, { freq: 660, start: now, duration: 0.16, type: 'triangle', gain: 0.16 });
    tone(audioCtx, { freq: 990, start: now + 0.08, duration: 0.22, type: 'triangle', gain: 0.16 });
  });
}

/** Ascending comic-book fanfare — used on level up. */
export function playLevelUp() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      tone(audioCtx, { freq, start: now + i * 0.09, duration: 0.22, type: 'square', gain: 0.11 });
    });
    noiseBurst(audioCtx, { start: now, duration: 0.3, gain: 0.08, filterFreqStart: 6000, filterFreqEnd: 2000 });
  });
}

/** Subtle UI click — used for the audio toggle, avatar picks, general buttons. */
export function playClick() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    tone(audioCtx, { freq: 520, freqEnd: 300, start: now, duration: 0.06, type: 'square', gain: 0.08 });
  });
}

/** Soft pop — used whenever any toast/notification appears. */
export function playToastPop() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    tone(audioCtx, { freq: 700, freqEnd: 900, start: now, duration: 0.09, type: 'sine', gain: 0.09 });
  });
}

/** Low buzzer — used for form errors / failed actions. */
export function playError() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    tone(audioCtx, { freq: 180, start: now, duration: 0.16, type: 'sawtooth', gain: 0.1 });
    tone(audioCtx, { freq: 140, start: now + 0.1, duration: 0.16, type: 'sawtooth', gain: 0.1 });
  });
}

/** Paper-flip / modal-open swoosh — used when a quest form or modal opens. */
export function playModalOpen() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    noiseBurst(audioCtx, { start: now, duration: 0.1, gain: 0.09, filterFreqStart: 2000, filterFreqEnd: 4500 });
  });
}

/** Quick descending swipe — used when closing a modal or deleting a quest. */
export function playModalClose() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    tone(audioCtx, { freq: 500, freqEnd: 180, start: now, duration: 0.12, type: 'triangle', gain: 0.08 });
  });
}

/** A short "spider-sense" tingle — used for streak milestones. */
export function playStreak() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    [1200, 1400, 1200].forEach((freq, i) => {
      tone(audioCtx, { freq, start: now + i * 0.07, duration: 0.09, type: 'sine', gain: 0.06 });
    });
  });
}

/** Rising power-up sting — used once when a user logs in successfully. */
export function playPowerUp() {
  play((audioCtx) => {
    const now = audioCtx.currentTime;
    tone(audioCtx, { freq: 220, freqEnd: 880, start: now, duration: 0.5, type: 'sawtooth', gain: 0.09 });
    noiseBurst(audioCtx, { start: now, duration: 0.4, gain: 0.06, filterFreqStart: 1500, filterFreqEnd: 5000 });
  });
}
