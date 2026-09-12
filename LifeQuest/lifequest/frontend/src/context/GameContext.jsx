import { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { user } = useAuth();
  const [character, setCharacter] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [levelUpEvent, setLevelUpEvent] = useState(null);

  const refreshCharacter = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/character');
      setCharacter(data.character);
    } catch {
      // Silently ignore - individual pages surface their own errors.
    }
  }, [user]);

  const pushToast = useCallback((title, body) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, body }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  /**
   * Applies the result of a completed quest: updates cached character state,
   * queues reward toasts, and opens the level-up modal for the one big moment.
   */
  const applyQuestResult = useCallback(
    (result) => {
      setCharacter((prev) => ({
        ...(prev || {}),
        level: result.character.level,
        totalXp: result.character.totalXp,
        gold: result.character.gold,
        xpIntoLevel: result.character.xpIntoLevel,
        xpForNextLevel: result.character.xpForNextLevel,
        progressPercent: result.character.progressPercent,
        streak: result.streak,
        attributes: prev?.attributes
          ? {
              ...prev.attributes,
              [result.rewards.attribute.name]:
                (prev.attributes[result.rewards.attribute.name] || 0) + result.rewards.attribute.amount,
            }
          : prev?.attributes,
      }));

      pushToast(
        'Quest complete',
        `+${result.rewards.xp} XP  ·  +${result.rewards.gold} Gold  ·  +${result.rewards.attribute.amount} ${result.rewards.attribute.name}`
      );

      result.achievementsUnlocked.forEach((a) => {
        pushToast('Achievement unlocked', a.name);
      });

      if (result.levelUp) {
        setLevelUpEvent({ level: result.character.level });
      }
    },
    [pushToast]
  );

  const dismissLevelUp = useCallback(() => setLevelUpEvent(null), []);

  return (
    <GameContext.Provider
      value={{ character, setCharacter, refreshCharacter, toasts, pushToast, applyQuestResult, levelUpEvent, dismissLevelUp }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
