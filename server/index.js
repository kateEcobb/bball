// var express = require('express');
// var app = express();

// app.get('/', function(req, res){
//   res.send('hello world');
// });

// app.listen(3000);

var moment = require('moment');



var elasticsearch = require('elasticsearch');
var generate = require('../data/generator.js')
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.ping({
  requestTimeout: 30000,
})
.then((response) => {
  console.log('All is well');
})
.catch((err) => {console.log('error')})

var massProduce = (gameId, startDate) => {
  var dataArray = generate.creator(gameId, startDate);
  client.bulk({body: dataArray})
  .then((response) => {
    console.log('insertresponse', response)
  })
  .catch((err) => {console.log('error', err)})
}

var totalGames = 4000;
var gamesSoFar = 0;
var gameStartTime = moment(1501608234000);
while(gamesSoFar < totalGames) {
  massProduce(gamesSoFar+1, gameStartTime);
  gamesSoFar+=1000;
  gameStartTime =gameStartTime.add(3, 'days')
}

/*

body: [
    // action description
    { index:  { _index: 'firsttry', _type: 'firsttrygame',} },
     // the document to index
    { gameDate: '2017-08-01 10:23:54',
      hometeam: 'Minnesota Timberwolves',
      awayTeam: 'Chicago Bulls',
      firstName: 'Nemanja',
      lastName: 'Bjelica',
      playType: 'miss',
      playLength: 11,
      points: 0,
      homeScore: 0,
      awayScore: 0
    }*/