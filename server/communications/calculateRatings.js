var cron = require('node-cron');
var mb = require('./messageBus');
var db = require('../../db/index.js');

var calculate = (results) => {
  console.log('logging results', results[1])
  var points = results.map((obj) => {
    return obj.sum;
  })
  var max = points.reduce(function(a, b) {
      return Math.max(a, b);
  });
  // var max = 55;
  var messages = results.map((obj) => {
    var sqsObj = {
      firstName: obj.first_name,
      lastName: obj.last_name,
      rating: (obj.sum/max) * 10
    }
    return sqsObj;
  });
  console.log(messages)
  messages.forEach((message) => {
    mb.sendToAnalytics(message);
  })
}

var getPlayerTotals = () => {
  var qstring = `select 
  p.player_id,
  player.first_name,
  player.last_name,
  sum(p.points)
  from play_info p 
  left outer join
  player_info player
  on
  p.player_id = player.id
  where
  p.player_id is not null
  group by
  p.player_id,
  player.first_name,
  player.last_name`
  db.query(qstring)
  .then((result) => {
    // console.log('query result', result[rows])
    calculate(result.rows);
  })
  .catch((err) => {
    console.log(err)
  })
}

// getPlayerTotals();
var task = cron.schedule('* * * * *', function(){
  //0 */45
  console.log('running a task every five minutes');
  getPlayerTotals();
 });
task.start();

/*select 
p.player_id,
sum(p.points)
from play_info p 
group by
p.player_id  */