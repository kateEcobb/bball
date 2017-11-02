var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var helpers = require('./helpers.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());


app.get('/', function(req, res){
  res.send('hello world');
});

app.post('/newgame', helpers.insertGame, function(req, res){
  console.log(req.body)
  res.send('game received');
});

app.listen(3000);

