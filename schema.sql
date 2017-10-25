CREATE TABLE team_info(
  id SERIAL PRIMARY KEY NOT NULL,
  team_name TEXT NOT NULL
);

CREATE TABLE player_info(
  id SERIAL PRIMARY KEY NOT NULL,
  team_id INT NOT NULL REFERENCES team_info(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE game_info(
  id SERIAL PRIMARY KEY NOT NULL,
  home_team_id INT NOT NULL REFERENCES team_info(id),
  away_team_id INT NOT NULL REFERENCES team_info(id),
  game_date TIMESTAMP
);

CREATE TABLE play_type(
  id SERIAL PRIMARY KEY NOT NULL,
  play_name TEXT NOT NULL
);

CREATE TABLE play_info(
  id SERIAL PRIMARY KEY NOT NULL,
  game_id INT NOT NULL REFERENCES game_info(id),
  team_id  INT REFERENCES team_info(id),
  play_type_id INT NOT NULL REFERENCES play_type(id),
  player_id INT REFERENCES player_info(id),
  -- period INT,
  points INT,
  home_score INT,
  away_score INT,
  play_length INT
);