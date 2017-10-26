//alread have players, play type, and team info (copy into storage to reference)
//grab two random teams, current timestamp for game info (save game id)

//generate 40,000 games
var fs = require('fs');
var moment = require('moment');
var data = require('./playerTeamArrays.js');

var allGames = [];
var allPlays = [];

var getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var startGame = (gameId, startTime) => {

  //get 2 random teams
  var random1 = getRandomInt(0, 29);
  var homeTeam = data.teams[random1].id;
  var random2 = getRandomInt(0, 29);
  while(random1 === random2) {
    random2 = getRandomInt(0, 29);
  }
  var awayTeam = data.teams[random2].id;

  var gameLine = `${homeTeam},${awayTeam},${startTime}\n`;

  //save plays
  allGames.push(gameLine);

  var gameInfo = {gameId, homeTeam, awayTeam};
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

  constructor(options) {
    this.gameId = options.gameId;
    this.homeTeam = options.homeTeam;
    this.awayTeam = options.awayTeam;
    this.homeScore = 0;
    this.awayScore = 0;
    this.gameTime = -1;
    this.homePlayers = getPlayers(this.homeTeam);
    this.awayPlayers = getPlayers(this.awayTeam);
  }

  initiatePlayCreation() {
    //keep calling create play until game is over
    //2880 seconds in a game
    while(this.gameTime < 2880) {
      this._createPlay();
    }
  }

  _createPlay() {
    //if game time is zero write start of period
    // console.log('new row', this.plays)

    var playType;
    var player = null;
    var points = null;
    var playLength = 0;
    var team = null;

    if(this.gameTime === -1) {
      playType = 1;
      this.gameTime = 0;
      var playLine = `${this.gameId},,,,${this.homeScore},${this.awayScore},${playLength}`
    } else {
      //generate random play type
      playType = data.playTypes[getRandomInt(0,1)].id
      //generate random player
      team = getRandomInt(0,1);
      if(team) {
        player = this.homePlayers[getRandomInt(0, this.homePlayers.length-1)].playerId;
      } else {
        player = this.awayPlayers[getRandomInt(0, this.awayPlayers.length-1)].playerId;
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
    }

    //save plays
    var playLine = `${this.gameId},${playType},${player},${points},${this.homeScore},${this.awayScore},${playLength}`
    allPlays.push(playLine);
  }
}

var createGame = () => {
  
  var gameCount = 1;
  //aug 1 2017
  var gameStartDate = moment(1501608234000);
  while(gameCount < 5000) {
    var gameInfo = startGame(gameCount, gameStartDate.format());
    var game = new Ballgame(gameInfo);
    game.initiatePlayCreation();
    gameStartDate.add(5, 'minutes');
    gameCount++;  
  }
  //save games
  fs.appendFile('./data/game_info.csv', allGames.join('\n') + '\n', (err) => {
    if (err) throw err;
    // console.log(`${gameLine} was appended to file!`);
  });
  //save plays
  fs.appendFile('./data/play_info.csv', allPlays.join('\n') + '\n', (err) => {
    if (err) throw err;
    // console.log(`${playLine} was appended to file!`);
  });
  
}
createGame();