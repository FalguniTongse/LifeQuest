import { useState } from 'react';
import { categoryColor } from '../utils/categoryColors';

export default function QuestCard({ quest, onComplete, onEdit, onDelete }) {
  const [busy, setBusy] = useState(false);
  const isCompleted = quest.status === 'COMPLETED';

  async function handleComplete() {
    setBusy(true);
    await onComplete(quest.id);
    setBusy(false);
  }

  return (
    <div className={`quest-entry${isCompleted ? ' completed' : ''}`}>
      <span className="quest-cat-dot" style={{ background: categoryColor(quest.category) }} />
      <div className="quest-main">
        <div className={`quest-title${isCompleted ? ' strike' : ''}`}>{quest.title}</div>
        <div className="quest-meta">
          <span>{quest.category}</span>
          <span className="dot">
            {quest.duration_minutes ? `${quest.duration_minutes} min` : 'No duration set'}
          </span>
          {quest.due_date && <span className="dot">{new Date(quest.due_date).toLocaleDateString()}</span>}
        </div>
      </div>
      <span className={`difficulty-badge difficulty-${quest.difficulty}`}>{quest.difficulty}</span>
      <div className="quest-reward">+{quest.reward_xp} XP · +{quest.reward_gold}g</div>
      {!isCompleted ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-outline btn-sm" onClick={() => onEdit(quest)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(quest.id)}>Delete</button>
          <button className="btn btn-primary btn-sm" onClick={handleComplete} disabled={busy}>
            {busy ? 'Completing…' : 'Complete'}
          </button>
        </div>
      ) : (
        <span className="achievement-locked-tag">Completed</span>
      )}
    </div>
  );
}
