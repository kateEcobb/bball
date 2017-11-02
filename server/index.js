
var moment = require('moment');

var elasticsearch = require('elasticsearch');
var generate = require('../data/generator.js')
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

// client.ping({
//   requestTimeout: 30000,
// })
// .then((response) => {
//   console.log('All is well');
// })
// .catch((err) => {console.log('error')})

var massProduce = (gameId, startDate, fakeReq) => {
  var dataArray = generate.creator(gameId, startDate, fakeReq);
  // if(!fakeReq) {
  //   return client.bulk({body: dataArray});
  // }
}

var batch = /*async*/ (totalGames, startDate, fakeReq) => {

  // var totalGames = 40000;
  var gamesSoFar = 0;
  // var gameStartTime = moment(1501608234000);
  var gameStartTime = moment(startDate);
  while(gamesSoFar < totalGames) {
    massProduce(gamesSoFar+1, gameStartTime, fakeReq);
    // await massProduce(gamesSoFar+1, gameStartTime, fakeReq)
    // .then((res) => {
    //   console.log('res', res)
    // })
    // .catch((err) => {
    //   console.log('err', err)
    // })
    // gamesSoFar+=200;
    gamesSoFar+=1;
    gameStartTime =gameStartTime.add(3, 'days')
  }

}
// batch();

module.exports.batch = batch;

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