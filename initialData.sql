--psql -f initialData.sql bball
COPY team_info (team_name) FROM '/Users/whitney/hr/thesis/data/team_info.csv' WITH (FORMAT csv);
COPY play_type (play_name) FROM '/Users/whitney/hr/thesis/data/play_type_info.csv' WITH (FORMAT csv);
COPY player_info (first_name, last_name, team_id) FROM '/Users/whitney/hr/thesis/data/player_info.csv' WITH (FORMAT csv);
--game data
COPY game_info (home_team_id, away_team_id, game_date) FROM '/Users/whitney/hr/thesis/data/game_info.csv' WITH (FORMAT csv);
--play data
COPY play_info (game_id, play_type_id, player_id, points, home_score, away_score, play_length, total_game_time) FROM '/Users/whitney/hr/thesis/data/play_info.csv' WITH (FORMAT csv);