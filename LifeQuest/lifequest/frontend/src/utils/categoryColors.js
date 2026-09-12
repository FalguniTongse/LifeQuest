export const CATEGORY_COLOR_VAR = {
  Coding: '--cat-coding',
  Study: '--cat-study',
  Reading: '--cat-reading',
  Fitness: '--cat-fitness',
  Meditation: '--cat-meditation',
  Art: '--cat-art',
  Social: '--cat-social',
};

export function categoryColor(category) {
  const varName = CATEGORY_COLOR_VAR[category] || '--slate';
  return `var(${varName})`;
}
