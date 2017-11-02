var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var helpers = require('./helpers.js');
var q = [];
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));

app.get('/', function(req, res){
  res.send('hello world');
});

/*RECEIPT PROCCESS

receive game info
push to q
check to see if game at time with same players has been played/inserted into db 
if so, get id and insert into db with play info
if not, create new game and get id
  save game id, team, start date in memory to reference wo querying db
save plays





*/


// app.post('/newgame', helpers.checkGameExists, helpers.addGame, helpers.addPlay, function(req, res){
//   res.send('game received');
// });
app.post('/newgame', function(req, res){
  q.push(req.body)
  res.send('game received');
});

app.listen(3000);

