//alread have players, play type, and team info (copy into storage to reference)
//grab two random teams, current timestamp for game info (save game id)

//generate 20,000 games

var data = require('./playerTeamArrays.js')

var getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var startGame = (gameId) => {
  //get 2 random teams
  var random1 = getRandomInt(0, 29);
  var homeTeam = data.teams[random1].id;
  var random2 = getRandomInt(0, 29);
  while(random1 === random2) {
    random2 = getRandomInt(0, 29);
  }
  var awayTeam = data.teams[random2].id;
  //write to csv
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
  constructor({gameId, homeTeam, awayTeam}) {
    this.gameId;
    this.homeTeam;
    this.awayTeam;
    this.homeScore = 0;
    this.awayScore = 0;
    this.gameTime = 0;
    this.homePlayers = getPlayers(this.homeTeam);
    this.awayPlayers = getPlayers(this.awayTeam);
    this.plays = []
    //720 seconds in a quarter
    //2880 seconds in a game
  }
  initiatePlayCreation() {
    //keep calling create play until
    while(this.gameTime < 2880) {
      this._createPlay();
    }
  }
  _createPlay() {
    //if game time is zero write start of period
    var playType;
    var player = null;
    var points = null;
    var playLength = 0;
    var team = null;
    if(this.gameTime === 0) {
      playType = 1;
    } else {
      //generate random play type
      playType = data.playTypes[getRandomInt(0,1)].id
      //generate random player
      team = getRandomInt(0,1);
      if(team) {
        player = this.homePlayers[getRandomInt(0, this.homePlayers.length-1)];
      } else {
        player = this.awayPlayers[getRandomInt(0, this.awayPlayers.length-1)];
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
      }

      //generate length of play
      if(this.gameTime > 2856) {
        playLength = 2880 - this.gameTime;
      } else {
        playLength = getRandomInt(1, 24);
        this.gameTime+= playLength;
      }
    }
  }
  _savePlay() {
    //save to array, insert when done
  }
}




var createGame = () => {
  
  var gameCount = 1;
  while(gameCount < 3) {
    var gameInfo = startGame(gameCount);
    var game = new Ballgame(gameInfo);
    game.initiatePlayCreation();
    gameCount++;  
  }
  
}
createGame();







//play info mvp
/*
keep a running total of current game time => sum of all play length

use game id
team id = randomly pick one
play type id = random between
player id = randomly choose from team roster
period = based on total game time 
points = if play type is shot, choose 2 or 3 (weigthed)
home score = keep running track
away score = keep running track
play length = random between 1-24 seconds (turnover, sub, free throw, end of period, timeout all 0) => decide what all you're going to use
*/



/*
keep a running total of current game time => sum of all play length

use game id
team id = randomly pick one
play type id = random
player id = randomly choose from team roster
period = based on total game time 
points = if play type is shot, choose 2 or 3 (weigthed)
home score = keep running track
away score = keep running track
play length = random between 1-24 seconds (turnover, sub, free throw, end of period, timeout all 0) => decide what all you're going to use
x = random 0-50 (x 0-5, 4-5 and y 0-12, 80-100 ish is 3 pt)
y = team 1 0-50, team2 50-100 (three point depends on ths?)

*/



//cron job 1/hr
