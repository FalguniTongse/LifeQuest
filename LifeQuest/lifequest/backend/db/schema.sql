-- LifeQuest database schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(32) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 0,
  intellect INTEGER NOT NULL DEFAULT 0,
  strength INTEGER NOT NULL DEFAULT 0,
  wellness INTEGER NOT NULL DEFAULT 0,
  creativity INTEGER NOT NULL DEFAULT 0,
  social INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  category VARCHAR(32) NOT NULL,
  difficulty VARCHAR(16) NOT NULL,
  duration_minutes INTEGER,
  due_date DATE,
  status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
  reward_xp INTEGER,
  reward_gold INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS xp_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id INTEGER REFERENCES quests(id) ON DELETE SET NULL,
  xp_amount INTEGER NOT NULL,
  reason VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  type VARCHAR(32) NOT NULL,
  rarity VARCHAR(16) NOT NULL,
  unique_item BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  description TEXT,
  condition_type VARCHAR(32) NOT NULL,
  condition_value INTEGER NOT NULL,
  reward_gold INTEGER NOT NULL DEFAULT 0,
  reward_xp INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_quests_user_id ON quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);
CREATE INDEX IF NOT EXISTS idx_quests_due_date ON quests(due_date);
CREATE INDEX IF NOT EXISTS idx_xp_history_user_id ON xp_history(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Seed data: shop items
INSERT INTO items (name, description, price, type, rarity, unique_item)
SELECT * FROM (VALUES
  ('Wanderer''s Cloak', 'A simple cloak for a traveler just starting out.', 50, 'avatar', 'Common', true),
  ('Bronze Frame', 'A humble frame to border your portrait.', 40, 'frame', 'Common', true),
  ('Midnight Theme', 'Recolor your journal in deep indigo ink.', 80, 'theme', 'Rare', true),
  ('Title: The Diligent', 'Display "The Diligent" beneath your name.', 100, 'title', 'Rare', true),
  ('Ember Background', 'A smoldering backdrop for your character page.', 120, 'background', 'Rare', true),
  ('Badge of Discipline', 'A pressed badge awarded to no one but the earned.', 150, 'badge', 'Epic', true),
  ('Skin: Ashwalker', 'A cosmetic skin cloaked in soot and starlight.', 220, 'skin', 'Epic', true),
  ('Title: Legend in Progress', 'A wry, well-earned title.', 300, 'title', 'Legendary', true)
) AS v(name, description, price, type, rarity, unique_item)
WHERE NOT EXISTS (SELECT 1 FROM items);

-- Seed data: achievements
INSERT INTO achievements (name, description, condition_type, condition_value, reward_gold, reward_xp)
SELECT * FROM (VALUES
  ('First Step', 'Complete your very first quest.', 'QUESTS_COMPLETED', 1, 10, 20),
  ('Week Warrior', 'Reach a 7-day streak.', 'STREAK', 7, 100, 0),
  ('Fortnight Flame', 'Reach a 14-day streak.', 'STREAK', 14, 200, 0),
  ('Legendary Discipline', 'Reach a 30-day streak.', 'STREAK', 30, 500, 0),
  ('Bookworm', 'Complete 10 reading quests.', 'CATEGORY_COUNT_READING', 10, 60, 0),
  ('Code Knight', 'Complete 50 coding quests.', 'CATEGORY_COUNT_CODING', 50, 250, 0),
  ('XP Master', 'Earn 1,000 total XP.', 'TOTAL_XP', 1000, 100, 0),
  ('Ten Quests Deep', 'Complete 10 quests total.', 'QUESTS_COMPLETED', 10, 40, 0)
) AS v(name, description, condition_type, condition_value, reward_gold, reward_xp)
WHERE NOT EXISTS (SELECT 1 FROM achievements);
