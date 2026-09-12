import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import AppLayout from '../components/AppLayout';
import XPBar from '../components/XPBar';

const ATTRIBUTES = [
  { key: 'intellect', label: 'Intellect', color: 'var(--cat-coding)' },
  { key: 'strength', label: 'Strength', color: 'var(--cat-fitness)' },
  { key: 'wellness', label: 'Wellness', color: 'var(--cat-meditation)' },
  { key: 'creativity', label: 'Creativity', color: 'var(--cat-art)' },
  { key: 'social', label: 'Social', color: 'var(--cat-social)' },
];

export default function Character() {
  const { user } = useAuth();
  const { character, refreshCharacter } = useGame();

  useEffect(() => {
    if (!character) refreshCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxAttr = character
    ? Math.max(1, ...ATTRIBUTES.map((a) => character.attributes[a.key] || 0))
    : 1;

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <h1>Character sheet</h1>
          <p className="lede">A living record of everything you've put in.</p>
        </div>
      </div>

      {!character ? (
        <div className="skeleton" style={{ height: 320 }} />
      ) : (
        <div className="grid-2">
          <div className="panel">
            <div className="panel-header">
              <h3>{user?.username}</h3>
              <span style={{ color: 'var(--gold-bright)' }}>Level {character.level}</span>
            </div>
            <div className="panel-body">
              <XPBar
                xpIntoLevel={character.xpIntoLevel}
                xpForNextLevel={character.xpForNextLevel}
                progressPercent={character.progressPercent}
              />
              <div className="grid-2" style={{ marginTop: 22 }}>
                <div className="stat-card">
                  <div className="stat-label">Gold</div>
                  <div className="stat-value gold">{character.gold}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Streak</div>
                  <div className="stat-value ember">{character.streak.current}d</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><h3>Attributes</h3></div>
            <div className="panel-body">
              {ATTRIBUTES.map((attr) => {
                const value = character.attributes[attr.key] || 0;
                const percent = Math.round((value / maxAttr) * 100);
                return (
                  <div className="attribute-row" key={attr.key}>
                    <div className="attribute-row-head">
                      <span className="name">{attr.label}</span>
                      <span className="value">{value}</span>
                    </div>
                    <div className="attribute-track">
                      <div className="attribute-fill" style={{ width: `${Math.max(percent, 4)}%`, background: attr.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
