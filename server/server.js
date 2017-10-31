var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// // parse application/json
// app.use(bodyParser.json());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));

app.get('/', function(req, res){
  res.send('hello world');
});

var receiveGame = (req, res, next) => {
  // console.log('response>>>>', req)
  next();
}

app.post('/newgame', receiveGame, function(req, res){
  //figure out how to handle receipt of many individual play by plays
  console.log('response>>>>', req.body)
  res.send('game received');
});

app.listen(3000);

