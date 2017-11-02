var db = require('../db/index.js');

var checkGameExists = (req, res, next) => {
  console.log('response>>>>', req.body)
  var qstring = `SELECT 
  g.id
  from game_info g 
  left outer join
  team_info homet
  on
  g.home_team_id = homet.id
  left outer join
  team_info awayt
  on
  g.away_team_id = awayt.id
  where 
  homet.team_name = '${req.body.homeTeam}'
  and
  awayt.team_name = '${req.body.awayTeam}'
  and
  g.game_date = '${req.body.gameDate}';`
  // var qstring = `SELECT 
  // g.id
  // from game_info g 
  // left outer join
  // team_info homet
  // on
  // g.home_team_id = homet.id
  // left outer join
  // team_info awayt
  // on
  // g.away_team_id = awayt.id
  // where 
  // homet.team_name = 'Golden State Warriors'
  // and
  // awayt.team_name = 'Milwaukee Bucks'
  // and
  // g.game_date = '2017-08-01 10:23:54';`
  // console.log(qstring)
  var gameDbId;
  db.query(qstring)
    .then((result) => {
      if(result) {
        gameDbId = result.id
      }
      req.gameDbId = gameDbId;
      console.log('gameid', result)
      next();
    })
    .catch((err) => {
      console.log(err)
    })
  
}

var addGame = (req, res, next) => {
  if(req.gameDbId) {
    console.log('skipped game adding')
    next();
  }

  var qstring = `insert into game_info (home_team_id, away_team_id, game_date) values ((select id from team_info where team_name = '${req.body.homeTeam}'), (select id from team_info where team_name = '${req.body.awayTeam}'), '${req.body.gameDate}') returning id`
  //(select id from team_info where team_name = 'Golden State Warriors'), (select id from team_info where team_name = 'Indiana Pacers')
  db.query(qstring)
    .then((result) => {
      req.gameDbId = result.id;
      next();
    })
    .catch((err) => {
      console.log(err)
    })
  //insert and set gamedbid
}

var addPlay = (req, res, next) => {
  console.log('addingplay', req.gameDbId);
  var qstring = `insert into play_info (game_id, play_type_id, player_id, points, home_score, away_score, play_length, total_game_time) 
  values (${req.gameDbId}, (select id from play_type where play_name = '${req.body.playType}'), 
  (select id from player_info where first_name = '${req.body.firstName}' and last_name = '${req.body.lastName}'), 
  ${req.body.points}, ${req.body.homeScore}, ${req.body.awayScore}, ${req.body.playLength}, '${req.body.totalGameTime}')`;
  db.query(qstring)
  .then((result) => {
    // req.gameDbId = result.id;
    console.log('play result', result)
    next();
  })
  .catch((err) => {
    console.log(err)
  })
}

module.exports.checkGameExists = checkGameExists;
module.exports.addGame = addGame;
module.exports.addPlay = addPlay;
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