import { useEffect, useState } from 'react';
import { playModalOpen, playModalClose, playError } from '../utils/sounds';

const CATEGORIES = ['Coding', 'Study', 'Reading', 'Fitness', 'Meditation', 'Art', 'Social'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic'];

export default function QuestFormModal({ initialQuest, onSubmit, onClose }) {
  const [title, setTitle] = useState(initialQuest?.title || '');
  const [description, setDescription] = useState(initialQuest?.description || '');
  const [category, setCategory] = useState(initialQuest?.category || 'Coding');
  const [difficulty, setDifficulty] = useState(initialQuest?.difficulty || 'Easy');
  const [durationMinutes, setDurationMinutes] = useState(initialQuest?.duration_minutes || '');
  const [dueDate, setDueDate] = useState(
    initialQuest?.due_date ? initialQuest.due_date.slice(0, 10) : ''
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initialQuest);

  useEffect(() => {
    playModalOpen();
  }, []);

  function handleClose() {
    playModalClose();
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Give your quest a title.');
      playError();
      return;
    }
    setSaving(true);
    const result = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      durationMinutes: durationMinutes ? Number(durationMinutes) : null,
      dueDate: dueDate || null,
    });
    setSaving(false);
    if (result && result.error) {
      setError(result.error);
      playError();
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleClose} role="presentation">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={isEdit ? 'Edit quest' : 'New quest'}>
        <div className="modal-head">
          <h3>{isEdit ? 'Edit quest' : 'New quest'}</h3>
          <button className="modal-close" onClick={handleClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          {error && <div className="form-error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="quest-title">Title</label>
              <input
                id="quest-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Finish chapter 3 of the algorithms book"
                maxLength={120}
              />
            </div>
            <div className="field">
              <label htmlFor="quest-desc">Description (optional)</label>
              <textarea
                id="quest-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any notes to your future self"
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="quest-category">Category</label>
                <select id="quest-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="quest-difficulty">Difficulty</label>
                <select id="quest-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="quest-duration">Duration (minutes)</label>
                <input
                  id="quest-duration"
                  type="number"
                  min="0"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="30"
                />
              </div>
              <div className="field">
                <label htmlFor="quest-due">Due date (optional)</label>
                <input
                  id="quest-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary btn-block" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create quest'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
