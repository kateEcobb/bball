--psql -f initialData.sql bball
COPY team_info (team_name) FROM '/Users/whitney/hr/thesis/data/team_info.csv' WITH (FORMAT csv);