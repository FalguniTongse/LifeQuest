/**
 * Original, generic "hero mask" avatar icons for the character sheet.
 * These are simple geometric silhouettes drawn from scratch in the
 * app's own palette — not reproductions of any copyrighted character
 * design or logo — so they're safe to ship as-is.
 */

function maskSvg({ face, lens, web = false }) {
  const webLines = web
    ? `<g stroke="${lens}" stroke-width="1.4" opacity="0.55">
         <path d="M50 6 L50 94 M6 50 L94 50 M16 16 L84 84 M84 16 L16 84" />
         <path d="M50 6 Q30 30 6 50 M50 6 Q70 30 94 50 M50 94 Q30 70 6 50 M50 94 Q70 70 94 50" />
       </g>`
    : '';

  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="clip"><circle cx="50" cy="50" r="50"/></clipPath>
    </defs>
    <g clip-path="url(#clip)">
      <rect width="100" height="100" fill="${face}"/>
      ${webLines}
      <path d="M8 46 Q50 18 92 46 Q94 62 84 66 Q66 50 50 50 Q34 50 16 66 Q6 62 8 46 Z" fill="${lens}"/>
      <path d="M18 46 Q50 30 82 46 Q80 54 72 56 Q60 46 50 46 Q40 46 28 56 Q20 54 18 46 Z" fill="${face}"/>
    </g>
  </svg>`;
}

function toDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const AVATARS = [
  { id: 'crimson', name: 'Crimson Web', face: '#dc1f1f', lens: '#0b0b0c' },
  { id: 'jet-black', name: 'Jet Black', face: '#0b0b0c', lens: '#dc1f1f' },
  { id: 'blood-moon', name: 'Blood Moon', face: '#7a0d0d', lens: '#f7f4f4' },
  { id: 'white-fang', name: 'White Fang', face: '#f7f4f4', lens: '#0b0b0c' },
  { id: 'gold-trim', name: 'Gold Trim', face: '#0b0b0c', lens: '#f0ac1f' },
  { id: 'scarlet', name: 'Scarlet Suit', face: '#ff4d43', lens: '#0b0b0c' },
].map((a) => ({ ...a, src: toDataUri(maskSvg({ face: a.face, lens: a.lens, web: true })) }));

const STORAGE_KEY = 'lifequest-avatar-id';

export function getSelectedAvatarId() {
  if (typeof window === 'undefined') return AVATARS[0].id;
  return window.localStorage.getItem(STORAGE_KEY) || AVATARS[0].id;
}

export function setSelectedAvatarId(id) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, id);
}

export function getAvatarById(id) {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}
