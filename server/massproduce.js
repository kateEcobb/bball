/*THE FLOW
intiate whole thing to create games in batches of 5000
create new game
keep saving to arrays until 5000 games
write to csvs
upload to elasticsearch
start over with the correct game id
insert to db
*/
//check ids are good to go
//query against game teams and play roster

var request = require('request');
var fs = require('fs');

//check elasticsearch portion tomorrow with better internet
//if doesn't work, ask about async await
//or write to json file and upload later
var createGames = require('./index.js'); 
createGames.batch(10000, 1501608234000);
// fs.createReadStream('./data/elasicsearchData.json').pipe(request.post({uri: 'http://localhost:9200/_bulk', 'Content-Type': 'application/x-ndjson'}, (err, res) => {console.log(err, res)}))
