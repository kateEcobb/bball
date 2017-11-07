var request = require('request');
var fs = require('fs');
var cron = require('node-cron');
var createGames = require('../server/index.js'); 

var addGames = () => {
  /*SET TOTAL NUMBER OF GAMES TO BE GENERATED*/
  var totalGames = 2;
  /*SET DATETIME FOR WHEN FIRST GAME SHOULD START*/
  //aug 1 2017 currently
  var gameStartTime = 1501608234000;
  createGames.batch(totalGames, gameStartTime, true)
}


var task = cron.schedule('* * * * *', function(){
  console.log('running a task every minute');
  addGames();
 });
task.start();
