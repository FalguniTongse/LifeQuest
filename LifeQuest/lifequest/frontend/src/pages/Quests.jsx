import { useEffect, useState } from 'react';
import api, { apiErrorMessage } from '../services/api';
import { useGame } from '../context/GameContext';
import AppLayout from '../components/AppLayout';
import QuestCard from '../components/QuestCard';
import QuestFormModal from '../components/QuestFormModal';

const FILTERS = ['ALL', 'PENDING', 'COMPLETED'];

export default function Quests() {
  const { applyQuestResult, refreshCharacter } = useGame();
  const [quests, setQuests] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);

  async function loadQuests() {
    try {
      const { data } = await api.get('/quests');
      setQuests(data.quests);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load your quests.'));
    }
  }

  useEffect(() => {
    loadQuests();
  }, []);

  async function handleCreateOrUpdate(payload) {
    try {
      if (editingQuest) {
        await api.put(`/quests/${editingQuest.id}`, payload);
      } else {
        await api.post('/quests', payload);
      }
      setModalOpen(false);
      setEditingQuest(null);
      await loadQuests();
      return { success: true };
    } catch (err) {
      return { error: apiErrorMessage(err, 'Could not save this quest.') };
    }
  }

  async function handleComplete(questId) {
    try {
      const { data } = await api.post(`/quests/${questId}/complete`);
      applyQuestResult(data);
      await loadQuests();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not complete that quest.'));
    }
  }

  async function handleDelete(questId) {
    if (!window.confirm('Delete this quest? This cannot be undone.')) return;
    try {
      await api.delete(`/quests/${questId}`);
      await loadQuests();
      await refreshCharacter();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not delete that quest.'));
    }
  }

  function openCreate() {
    setEditingQuest(null);
    setModalOpen(true);
  }

  function openEdit(quest) {
    setEditingQuest(quest);
    setModalOpen(true);
  }

  const visibleQuests = quests
    ? quests.filter((q) => (filter === 'ALL' ? true : filter === 'PENDING' ? q.status === 'PENDING' : q.status === 'COMPLETED'))
    : [];

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <h1>Quests</h1>
          <p className="lede">Your full quest log — create, edit and complete real-world goals.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New quest</button>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="panel">
        {quests === null ? (
          <div className="panel-body stack">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 60 }} />)}
          </div>
        ) : visibleQuests.length === 0 ? (
          <div className="empty-state">
            <h4>No quests here</h4>
            <p>Create a new quest to add it to your log.</p>
          </div>
        ) : (
          <div>
            {visibleQuests.map((q) => (
              <QuestCard key={q.id} quest={q} onComplete={handleComplete} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <QuestFormModal
          initialQuest={editingQuest}
          onSubmit={handleCreateOrUpdate}
          onClose={() => { setModalOpen(false); setEditingQuest(null); }}
        />
      )}
    </AppLayout>
  );
}
