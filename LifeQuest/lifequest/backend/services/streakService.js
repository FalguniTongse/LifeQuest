/**
 * Streak calculation based on calendar dates (UTC, date-only).
 * Rules:
 *  - Same day as last activity: no change to current streak.
 *  - Exactly one day after last activity: increment current streak.
 *  - A gap of more than one day: reset current streak to 1.
 *  - No prior activity: start current streak at 1.
 */

function toDateOnly(d) {
  const date = new Date(d);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function daysBetween(a, b) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((toDateOnly(b) - toDateOnly(a)) / MS_PER_DAY);
}

function applyActivity({ lastActivityDate, currentStreak, longestStreak }, activityDate = new Date()) {
  const today = toDateOnly(activityDate);

  if (!lastActivityDate) {
    const streak = 1;
    return { currentStreak: streak, longestStreak: Math.max(longestStreak || 0, streak), lastActivityDate: today, changed: true };
  }

  const gap = daysBetween(lastActivityDate, today);

  if (gap === 0) {
    // Already logged activity today - no change, but not an error.
    return { currentStreak, longestStreak, lastActivityDate: toDateOnly(lastActivityDate), changed: false };
  }

  const nextStreak = gap === 1 ? currentStreak + 1 : 1;
  const nextLongest = Math.max(longestStreak || 0, nextStreak);

  return { currentStreak: nextStreak, longestStreak: nextLongest, lastActivityDate: today, changed: true };
}

module.exports = { applyActivity, toDateOnly, daysBetween };
