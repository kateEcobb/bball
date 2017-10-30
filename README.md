# bball
To generate/import historical data:
create db bball
psql -f schema.sql bball
run server/index.js file
psql -f initialData.sql bball
