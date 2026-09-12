// Maps a quest category to the character attribute column it grows.
const CATEGORY_ATTRIBUTE_MAP = {
  Coding: 'intellect',
  Study: 'intellect',
  Reading: 'intellect',
  Fitness: 'strength',
  Meditation: 'wellness',
  Art: 'creativity',
  Social: 'social',
};

const DIFFICULTY_ATTRIBUTE_POINTS = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Epic: 5,
};

function attributeForCategory(category) {
  return CATEGORY_ATTRIBUTE_MAP[category] || 'intellect';
}

function attributePointsForDifficulty(difficulty) {
  return DIFFICULTY_ATTRIBUTE_POINTS[difficulty] || 1;
}

module.exports = { attributeForCategory, attributePointsForDifficulty, CATEGORY_ATTRIBUTE_MAP };
