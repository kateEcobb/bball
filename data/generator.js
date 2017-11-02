var fs = require('fs');
var moment = require('moment');
var data = require('./playerTeamArrays.js');
var send = require('../externalsimulation/sendReq.js');
var request = require('request');

var allGames = [];
var allPlays = [];
var elastiRows = [];

var getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var startGame = (gameId, startTime) => {

  //get 2 random teams
  var random1 = getRandomInt(0, 29);
  var homeTeam = data.teams[random1].id;
  var homeTeamName = data.teams[random1].name;
  var random2 = getRandomInt(0, 29);
  while(random1 === random2) {
    random2 = getRandomInt(0, 29);
  }
  var awayTeam = data.teams[random2].id;
  var awayTeamName = data.teams[random2].name;

  var gameLine = `${homeTeam},${awayTeam},${startTime}`;

  //save plays
  allGames.push(gameLine);

  var gameInfo = {gameId, homeTeam, awayTeam, homeTeamName, awayTeamName};
  return gameInfo;
}

var getPlayers = (teamId) => {
  var teamRoster = [];
  data.players.forEach((player) => {
    if(player.teamId === teamId) {
      teamRoster.push(player);
    }
  })
  return teamRoster;
}

class Ballgame {

  constructor(options, gameStart, fakeReq) {
    this.gameId = options.gameId;
    this.homeTeam = options.homeTeam;
    this.awayTeam = options.awayTeam;
    this.homeScore = 0;
    this.awayScore = 0;
    this.gameTime = -1;
    this.homePlayers = getPlayers(this.homeTeam);
    this.awayPlayers = getPlayers(this.awayTeam);
    this.homeTeamName = options.homeTeamName;
    this.awayTeamName = options.awayTeamName;
    this.gameStart = gameStart;
    this.currentTime = moment(gameStart);
    this.fakeReq = fakeReq;
  }

  initiatePlayCreation() {
    //keep calling create play until game is over
    //2880 seconds in a game
   while(this.gameTime < 2880) {
      this._createPlay();
    }
  }

  _createPlay() {
    var playType;
    var playTypeName;
    var player = null;
    var playerFn;
    var playerLn;
    var points = null;
    var playLength = 0;
    var team = null;

    if(this.gameTime === -1) {
      playType = 1;
      this.gameTime = 0;
      var playLine = `${this.gameId},${playType},,,${this.homeScore},${this.awayScore},${playLength},${this.currentTime.format()}`;
      playTypeName = 'start of game';
    } else {
      //generate random play type
      var playRand = getRandomInt(0,1);
      playType = data.playTypes[playRand].id;
      playTypeName = data.playTypes[playRand].type;
      //generate random player
      team = getRandomInt(0,1);
      if(team) {
        var playerRand = getRandomInt(0, this.homePlayers.length-1)
        player = this.homePlayers[playerRand].playerId;
        playerFn = this.homePlayers[playerRand].firstName;
        playerLn = this.homePlayers[playerRand].lastName;
      } else {
        var playerRand = getRandomInt(0, this.awayPlayers.length-1);
        player = this.awayPlayers[playerRand].playerId;
        playerFn = this.awayPlayers[playerRand].firstName;
        playerLn = this.awayPlayers[playerRand].lastName;
      } 

      //generate point val if random play type = shot
      if(playType === 4) {
        points = getRandomInt(2,3);
        //add to correct score count
        if(team) {
          this.homeScore+= points;
        } else {
          this.awayScore+= points;
        }
      } else if (playType === 5) {
        points = 0;
      }

      //generate length of play
      if(this.gameTime > 2856) {
        playLength = 2880 - this.gameTime;
      } else {
        playLength = getRandomInt(1, 24);
      }
      this.gameTime+= playLength;
      this.currentTime = this.currentTime.add(playLength, 'seconds');
      // console.log(this.currentTime.format());
      //save plays
      var playLine = `${this.gameId},${playType},${player},${points},${this.homeScore},${this.awayScore},${playLength},${this.currentTime.format()}`
    }

    
    allPlays.push(playLine);
    var elastiObj = {
      gameDate: this.gameStart,
      homeTeam: this.homeTeamName,
      awayTeam: this.awayTeamName,
      firstName: playerFn,
      lastName: playerLn,
      playType: playTypeName,
      playLength: playLength,
      totalGameTime: this.currentTime.format(),
      points: points,
      homeScore: this.homeScore,
      awayScore: this.awayScore
    }
    if(!this.fakeReq) {
      elastiRows.push(JSON.stringify({ index:  { _index: 'rocket', _type: 'firstshot' } },))
    } 
    elastiRows.push(JSON.stringify(elastiObj));
  }
}

var createGame = (gameId, gameStart, fakeReq) => {
  
  var gameCount = gameId;
  //aug 1 2017
  //1501608234000
  var gameStartDate = moment(gameStart);
  while(gameCount < gameId + 1 /*200*/) {
    var gameInfo = startGame(gameCount, gameStartDate.format());
    var game = new Ballgame(gameInfo, gameStartDate.format(), fakeReq);
    game.initiatePlayCreation();

    gameStartDate.add(5, 'minutes');
    gameCount++;  
  }
  
  //save games
  if(!fakeReq) {
    fs.appendFile('./data/game_info.csv', allGames.join('\n') + '\n', (err) => {
      if (err) throw err;
    });
    fs.appendFile('./data/play_info.csv', allPlays.join('\n') + '\n', (err) => {
      if (err) throw err;
    });
    // var xxx = elastiRows.join('\n');
    // fs.appendFile('./data/elasicsearchData.json', xxx, (err) => {
    //   if (err) throw err;
    // });
  } else {
    // var xxx = elastiRows.join(',');
    // fs.appendFile('./data/elasicsearchData.json', JSON.stringify(elastiRows), (err) => {
    //   if (err) throw err;
    // });
    //send http request
    // console.log(JSON.parse(elastiRows[0]))
    // var ss = JSON.parse(elastiRows[0])
    // var data = {test:'test'}
    // request.post({
    // url: 'http://localhost:3000/newgame',
    // // method: 'POST',
    // headers: {'content-type': 'application/json'},
    // // 'Content-Type': 'application/json',
    // body: elastiRows[0]});

    // elastiRows.forEach((val, i) => {
    //   if(i === 0) {

     
    //   request.post({
    //     url: 'http://localhost:3000/newgame',
    //     // method: 'POST',
    //     headers: {'content-type': 'application/json'},
    //     // 'Content-Type': 'application/json',
    //     body: val});

    //   }
    // })
    send.sendGame(elastiRows)


  }

  allGames = [];
  allPlays = [];
  // console.log(typeof elastiRows[0])


  var returnVal = elastiRows;
  elastiRows = [];
  return returnVal;
}
// createGame();
module.exports.creator = createGame;