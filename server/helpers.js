var db = require('../db/index.js');

var insertGame = (req, res, next) => {
  var obj = req.body;
  var qstring = `insert into play_info (home_team_id, away_team_id, game_start_date, play_type_id, player_id, points, home_score, away_score, play_length, total_game_time) 
  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
  var params = [obj.homeTeamId, obj.awayTeamId, obj.gameDate, 1, 1, obj.points, obj.homeScore, obj.awayScore, obj.playLength, obj.totalGameTime]
  db.query(qstring, params)
  .then((result) => {
    console.log('insert result', result)
    next();
  })
  .catch((err) => {
    console.log(err)
  })
}

module.exports.insertGame = insertGame;
//IF YOU IMPLEMENT A CACHE
//new play batch comes in
//check to see if game is in memory
//if so, use id for insert
//if not
//check to see if game is in db
//if so, get id and play
//if not, insert and get id
//save that id to memory

//OTHERWISE
//check to see if game is in db
//if so, use id
//if not, create, then use id