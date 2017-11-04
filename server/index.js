var moment = require('moment');
var generate = require('../data/generator.js')


var massProduce = (gameId, startDate, fakeReq) => {
  var dataArray = generate.creator(gameId, startDate, fakeReq);
}

var batch = /*async*/ (totalGames, startDate, fakeReq) => {

  var gamesSoFar = 0;
  
  var gameStartTime = moment(startDate);
  
  while(gamesSoFar < totalGames) {
    massProduce(gamesSoFar+1, gameStartTime, fakeReq);
    gamesSoFar+=1; //200
    gameStartTime =gameStartTime.add(3, 'days')
  }

}
// batch();

module.exports.batch = batch;
