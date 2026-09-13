/**
 * Hero voice greeting — uses the browser's built-in SpeechSynthesis API.
 * This is a generic synthesized voice, not a recording or impersonation
 * of any copyrighted character's voice.
 */

import { isAudioEnabled } from './sounds';

const GREETINGS = [
  "Welcome back, hero. Your city's quest log is waiting.",
  'Suit up. There are quests to complete today.',
  "Nice to see you again. Let's keep that streak alive.",
  'Your next quest is calling. Time to swing into action.',
];

export function speakGreeting(username) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (!isAudioEnabled()) return;

  try {
    window.speechSynthesis.cancel();
    const line = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    const text = username ? `${line.replace('hero', username)}` : line;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 0.9;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /male|david|daniel|google us english/i.test(v.name));
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  } catch {
    // Voice is a nice-to-have; never let it break the app.
  }
}

export function isVoiceSupported() {
  return typeof window !== 'undefined' && Boolean(window.speechSynthesis);
}
