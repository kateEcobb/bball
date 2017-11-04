var AWS = require('aws-sdk');
AWS.config.loadFromPath('./externalServer/config/config.json');
var db = require('../../db/index.js');

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var queueURL = "https://sqs.us-east-1.amazonaws.com/630349627985/playerRating";


var params = {
  Attributes: {
   "ReceiveMessageWaitTimeSeconds": "3",
  },
  QueueUrl: queueURL
 };
 
 sqs.setQueueAttributes(params, function(err, data) {
   if (err) {
     console.log("Error", err);
   } else {
     console.log("Success", data);
   }
 });

//you're giong to have to move this so it doesn't get rewritten?
var localCache = [];


var receive = () => {

  var params = {
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
      "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
  };
  
  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else {
      console.log('message received', data.Messages[0].Body)
      checkCacheForGame(JSON.parse(data.Messages[0].Body), data.Messages[0].ReceiptHandle)
    }
  });
}


function addToCache(obj) {
  localCache.unshift(obj);
  localCache = localCache.slice(0, 5);
  console.log('current local cache', localCache)
}


var checkCacheForGame = (message, receiptId) => {

  message.deleteId = receiptId;

  var gameId;
  localCache.some((cacheGame) => {
    //if time and teams match new play
    var hasGame = false;
    if (cacheGame.homeTeam === message.homeTeam && cacheGame.awayTeam === message.awayTeam && cacheGame.gameDate === message.gameDate) {
      hasGame = true;
      gameId = cacheGame.gameId;
    }
    return hasGame;
  })

  if(gameId) {
    //insert play
    console.log('found in cache', gameId)
    message.gameId = gameId;
    insertPlay(message);
  } else {
    //check db for game]
    console.log('NOT found in cache')
    checkDbForGame(message)
  }
}


var checkDbForGame = (message) => {

  var qString = `SELECT g.id
                  from game_info g
                  left outer join
                  team_info homet on g.home_team_id = homet.id
                  left outer join team_info awayt on g.away_team_id = awayt.id
                  where homet.team_name = $1 and awayt.team_name = $2 and g.game_date = $3`;
  var params = [message.homeTeam, message.awayTeam, message.gameDate];

  db.query(qString, params)
    .then((results) => {
      console.log('query results', results.rows[0]);

      //if results are empty
      if(results.rows.length === 0) {
        //insert game
        console.log('game does NOT exist, inserting')
        insertGame(message);
      } else {
        //use id
        console.log('game existed', results.rows[0].id);
        message.gameId = results.rows[0].id;
        addToCache({gameId: message.gameId, homeTeam:message.homeTeam, awayTeam:message.awayTeam, gameDate:message.gameDate})
        insertPlay(message);
      }
    })
    .catch((err) => {
      console.log('error searching for game', err)
    })
}


var insertGame = (message) => {
  
  var qString = `insert into game_info (home_team_id, away_team_id, game_date) 
                  values ((select id from team_info where team_name = $1), (select id from team_info where team_name = $2), $3) 
                  returning id`;
  var params = [message.homeTeam, message.awayTeam, message.gameDate];

  db.query(qString, params)
    .then((results) => {
      console.log('successful game insert',results.rows[0].id)
      message.gameId = results.rows[0].id;
      insertPlay(message);
    })
    .catch((err) => {
      console.log('error inserting game', err)
    })
}


var insertPlay = (message) => {

  var qString = `insert into play_info (game_id, team_id, play_type_id, player_id, points, home_score, away_score, play_length, total_game_time) 
                  values ($1, (select team_id from player_info where first_name = $3 and last_name = $4),
                  (select id from play_type where play_name = $2), 
                  (select id from player_info where first_name = $3 and last_name = $4), 
                  $5, $6, $7, $8, $9);`;
  var params = [message.gameId, message.playType, message.firstName, message.lastName, message.points, message.homeScore, message.awayScore, message.playLength, message.totalGameTime];

  db.query(qString, params)
    .then((results) => {
      console.log('play inserted', results.rows[0])
      deleteMessage(message.deleteId)
    })
    .catch((err) => {
      console.log('error inserting play', err)
    })
}


var deleteMessage = (receiptId) => {
  var deleteParams = {
    QueueUrl: queueURL,
    ReceiptHandle: receiptId
  };
  sqs.deleteMessage(deleteParams, function(err, data) {
    if (err) {
      console.log("Delete Error", err);
    } else {
      console.log("Message Deleted", data);
    }
  });
}
// receive();
setInterval(receive, 1000)
// module.exports.recieveGame = receive;


/* FLOW
create some type of local storage for recent games
if game exists with same teams/start time
  use id
if not
  query games to see if a game exists
  if exists, get id
  if doesn't exist, create and get id
insert play 
delete message from q
keep going
*/
