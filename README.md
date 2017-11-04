# bball
To import historical data:
create db bball
psql -f schema.sql bball
run server/index.js file
psql -f initialData.sql bball


To generate mass amounts of new fake data:
  This script generates fake game data and writes new games and plays to csv files to copy to db.
  $ node server/massproduce.js

To send new games to http endpoint
  This script generates new games and sends to http endpoint (externalServer/server.js port 2020).
  $ node externalsimulation/index.js

To process messages from interal queue:
  This script grabs messages from internal sqs and processes data.
  $ node server/communications/receiveGames.js

To calculate and send messages to analytics:
  This script calculates player rating and sends the data thru SQS to Analytics Service
  $ node server/communications/calculateRatings.js

server/server.js and server/helpers.js no longer needed???