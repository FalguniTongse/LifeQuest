import { useEffect, useState } from 'react';
import api, { apiErrorMessage } from '../services/api';
import AppLayout from '../components/AppLayout';

export default function Achievements() {
  const [all, setAll] = useState(null);
  const [unlocked, setUnlocked] = useState(new Map());
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/achievements'), api.get('/achievements/user')])
      .then(([allRes, userRes]) => {
        setAll(allRes.data.achievements);
        setUnlocked(new Map(userRes.data.unlocked.map((u) => [u.id, u.unlocked_at])));
      })
      .catch((err) => setError(apiErrorMessage(err, 'Could not load achievements.')));
  }, []);

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <h1>Achievements</h1>
          <p className="lede">Milestones that mark how far you've come.</p>
        </div>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div className="panel">
        {all === null ? (
          <div className="panel-body stack">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 60 }} />)}
          </div>
        ) : (
          <div>
            {all.map((a) => {
              const isUnlocked = unlocked.has(a.id);
              return (
                <div className={`achievement-row${isUnlocked ? ' unlocked' : ''}`} key={a.id}>
                  <div className="achievement-seal">{isUnlocked ? '✓' : '?'}</div>
                  <div style={{ flex: 1 }}>
                    <div className="achievement-name">{a.name}</div>
                    <div className="achievement-desc">{a.description}</div>
                  </div>
                  <div className="achievement-locked-tag">
                    {isUnlocked ? `Unlocked ${new Date(unlocked.get(a.id)).toLocaleDateString()}` : 'Locked'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
