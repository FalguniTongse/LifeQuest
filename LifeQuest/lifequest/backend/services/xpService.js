/**
 * XP & non-linear level curve.
 * Total XP required to REACH a given level: 100 * level^1.5 (cumulative-feeling curve
 * expressed as "XP needed since level 1"). We treat totalXp as lifetime XP and derive
 * level by walking the curve, which keeps the model simple, deterministic and easy to audit.
 */

function xpRequiredForLevel(level) {
  // XP required to go from level `level` to `level + 1`
  return Math.round(100 * Math.pow(level, 1.5));
}

/**
 * Given a lifetime total XP value, derive the current level, XP into the current level,
 * and XP required for the next level.
 */
function deriveLevelState(totalXp) {
  let level = 1;
  let remaining = totalXp;

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
    if (level > 999) break; // safety guard
  }

  const xpForNextLevel = xpRequiredForLevel(level);
  const progressPercent = Math.min(100, Math.round((remaining / xpForNextLevel) * 100));

  return {
    level,
    xpIntoLevel: remaining,
    xpForNextLevel,
    progressPercent,
  };
}

const DIFFICULTY_REWARDS = {
  Easy: { xp: 50, gold: 20 },
  Medium: { xp: 100, gold: 40 },
  Hard: { xp: 175, gold: 70 },
  Epic: { xp: 300, gold: 120 },
};

function baseRewardForDifficulty(difficulty) {
  return DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.Easy;
}

module.exports = { xpRequiredForLevel, deriveLevelState, baseRewardForDifficulty };
