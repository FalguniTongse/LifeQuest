import { useGame } from '../context/GameContext';

export default function LevelUpModal() {
  const { levelUpEvent, dismissLevelUp } = useGame();
  if (!levelUpEvent) return null;

  return (
    <div className="modal-backdrop" onClick={dismissLevelUp} role="presentation">
      <div className="levelup-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Level up">
        <div className="levelup-eyebrow">A new chapter begins</div>
        <div className="levelup-number">Level {levelUpEvent.level}</div>
        <p className="levelup-sub">Your persistence is starting to show. Keep the streak alive.</p>
        <button className="btn btn-primary" onClick={dismissLevelUp} autoFocus>
          Continue the journey
        </button>
      </div>
    </div>
  );
}
