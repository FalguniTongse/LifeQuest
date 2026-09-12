export default function XPBar({ xpIntoLevel = 0, xpForNextLevel = 100, progressPercent = 0 }) {
  return (
    <div>
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="xp-bar-meta">
        <span>{xpIntoLevel} XP</span>
        <span>{xpForNextLevel} XP to next level</span>
      </div>
    </div>
  );
}
