import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import XPBar from '../components/XPBar';
import QuestCard from '../components/QuestCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { character, refreshCharacter, applyQuestResult } = useGame();
  const [quests, setQuests] = useState(null);
  const [error, setError] = useState('');

  async function loadAll() {
    try {
      const [questRes] = await Promise.all([api.get('/quests?status=PENDING'), refreshCharacter()]);
      setQuests(questRes.data.quests.slice(0, 5));
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load your dashboard.'));
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleComplete(questId) {
    try {
      const { data } = await api.post(`/quests/${questId}/complete`);
      applyQuestResult(data);
      setQuests((prev) => prev.filter((q) => q.id !== questId));
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not complete that quest.'));
    }
  }

  const loading = !character || quests === null;

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <h1>Welcome back, {user?.username}</h1>
          <p className="lede">Here's where your progress stands today.</p>
        </div>
        <Link to="/quests" className="btn btn-primary">+ New quest</Link>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="stack">
          <div className="grid-4">
            <StatCard label="Level" value={character.level} />
            <StatCard label="Gold" value={character.gold} tone="gold" />
            <StatCard label="Current streak" value={`${character.streak.current} day${character.streak.current === 1 ? '' : 's'}`} tone="ember" />
            <StatCard label="Longest streak" value={`${character.streak.longest} day${character.streak.longest === 1 ? '' : 's'}`} />
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Experience</h3>
              <span style={{ color: 'var(--parchment-dim)', fontSize: '0.85rem' }}>{character.progressPercent}% to next level</span>
            </div>
            <div className="panel-body">
              <XPBar
                xpIntoLevel={character.xpIntoLevel}
                xpForNextLevel={character.xpForNextLevel}
                progressPercent={character.progressPercent}
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Today's quests</h3>
              <Link to="/quests" style={{ color: 'var(--gold-bright)', fontSize: '0.85rem' }}>View all →</Link>
            </div>
            {quests.length === 0 ? (
              <div className="empty-state">
                <h4>No pending quests</h4>
                <p>Create one to keep your streak going.</p>
              </div>
            ) : (
              <div>
                {quests.map((q) => (
                  <QuestCard key={q.id} quest={q} onComplete={handleComplete} onEdit={() => {}} onDelete={() => {}} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function DashboardSkeleton() {
  return (
    <div className="stack">
      <div className="grid-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 84 }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 110 }} />
      <div className="skeleton" style={{ height: 220 }} />
    </div>
  );
}
