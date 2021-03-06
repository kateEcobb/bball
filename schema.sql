CREATE TABLE team_info(
  id SERIAL PRIMARY KEY NOT NULL,
  team_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE player_info(
  id SERIAL PRIMARY KEY NOT NULL,
  team_id INT NOT NULL REFERENCES team_info(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE game_info(
  id SERIAL PRIMARY KEY NOT NULL,
  home_team_id INT NOT NULL REFERENCES team_info(id),
  away_team_id INT NOT NULL REFERENCES team_info(id),
  game_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (home_team_id, away_team_id, game_date)
);

CREATE TABLE play_type(
  id SERIAL PRIMARY KEY NOT NULL,
  play_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

/*FIX FOR DEFAULT TS*/
CREATE TABLE play_info(
  id SERIAL PRIMARY KEY NOT NULL,
  game_id INT NOT NULL REFERENCES game_info(id),
  -- home_team_id INT NOT NULL REFERENCES team_info(id),
  -- away_team_id INT NOT NULL REFERENCES team_info(id),
  -- game_start_date TIMESTAMP,
  team_id  INT REFERENCES team_info(id),
  play_type_id INT NOT NULL REFERENCES play_type(id),
  player_id INT REFERENCES player_info(id),
  points INT,
  home_score INT,
  away_score INT,
  play_length INT,
  total_game_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);