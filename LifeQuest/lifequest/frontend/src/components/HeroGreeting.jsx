import { useEffect, useState } from 'react';
import { getAvatarById, getSelectedAvatarId } from '../utils/avatars';
import { speakGreeting, isVoiceSupported } from '../utils/voice';
import { playClick } from '../utils/sounds';

/**
 * A comic-style welcome banner shown once per browser session on the
 * dashboard. Uses one of the app's own original mask avatars (not any
 * copyrighted character art) and the browser's built-in voice synthesis
 * for the "hello" line (not a recording of any real or fictional voice).
 */
export default function HeroGreeting({ username }) {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('lifequest-greeted') === 'true');
  const avatar = getAvatarById(getSelectedAvatarId());

  useEffect(() => {
    if (dismissed) return;
    // Best effort — most browsers allow this since it follows the login click.
    speakGreeting(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dismissed) return null;

  function handleDismiss() {
    sessionStorage.setItem('lifequest-greeted', 'true');
    setDismissed(true);
    playClick();
  }

  function handleReplay() {
    speakGreeting(username);
    playClick();
  }

  return (
    <div className="hero-greeting" role="status">
      <img src={avatar.src} alt={avatar.name} className="hero-greeting-avatar" />
      <div className="hero-greeting-bubble">
        <p>
          Welcome back, <strong>{username}</strong>. Your city's quest log is waiting.
        </p>
        <div className="hero-greeting-actions">
          {isVoiceSupported() && (
            <button type="button" className="btn btn-outline btn-sm" onClick={handleReplay}>
              🔊 Replay
            </button>
          )}
          <button type="button" className="btn btn-primary btn-sm" onClick={handleDismiss}>
            Let's go
          </button>
        </div>
      </div>
    </div>
  );
}
