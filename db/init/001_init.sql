CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

-- user: demo / password (bcrypt hash example)
INSERT INTO users (username, password_hash)
VALUES ('demo', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8p1G/1hW1g6YfKzO0u/6uFJg1Yy1G6');

-- Yugioh articles
INSERT INTO articles (title, summary, content, tags) VALUES
('Blue-Eyes White Dragon', 'Iconic high-ATK Dragon monster.', 'Blue-Eyes White Dragon is one of the most famous monsters in the Yu-Gi-Oh! franchise. It is known for its high attack points and multiple support cards such as "Blue-Eyes Alternative White Dragon" and "Blue-Eyes Spirit Dragon".', ARRAY['monster','dragon','classic']),
('Dark Magician', 'The signature Spellcaster of Yugi.', 'Dark Magician is the signature card of Yugi Muto. There are numerous support cards like "Magician''s Rod", "Dark Magical Circle", and "Magician''s Navigation".', ARRAY['monster','spellcaster','signature']),
('Synchro Summon', 'Extra Deck mechanic introduced in GX.', 'Synchro Summon is a mechanic that allows players to summon Synchro Monsters from the Extra Deck by using Tuner and non-Tuner monsters whose levels add up to the Synchro Monster''s level.', ARRAY['mechanic','extra deck']),
('Exodia the Forbidden One', 'Win condition by assembling five cards.', 'Exodia is a set of five cards; if a player assembles all five pieces in their hand, they win the duel automatically. The pieces are powerful and have inspired many deck strategies.', ARRAY['monster','win-condition']),
('Pendulum Summon', 'Scale-based summoning for multiple monsters.', 'Pendulum Summon uses Pendulum Scales to summon multiple monsters from the hand or face-up Pendulum Zone, enabling tempo plays and combos.', ARRAY['mechanic','pendulum']),
('Trap Cards', 'Cards activated in response to actions.', 'Trap cards are placed face-down and can be activated during the opponent''s turn or in response to certain triggers, providing defensive and disruptive options.', ARRAY['card-type','trap']);
