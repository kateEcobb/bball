//cron job
//call function that generates new data
//sends thru http request to internal server
var request = require('request');
var fs = require('fs');
var cron = require('node-cron');
var createGames = require('../server/index.js'); 

// cron.schedule('* * * * *', function(){
//  console.log('running a task every minute');
// });

var addGames = () => {
  /*SET TOTAL NUMBER OF GAMES TO BE GENERATED*/
  var totalGames = 2;
  /*SET DATETIME FOR WHEN FIRST GAME SHOULD START*/
  //aug 1 2017 currently
  var gameStartTime = 1501608234000;
  createGames.batch(totalGames, gameStartTime, true)
  // var data = createGames.batch(totalGames, gameStartTime);
  

  //create file with new games
  //when file is done being written (async stuff dont forget!)
  //send each play individually or in small batches
  //go to server.js

  // fs.createReadStream('./data/elasicsearchData.json').pipe(request.post({uri: 'http://localhost:3000/newgame'}, (err, res) => {console.log(err, res)}));

  //delete file
//{uri: 'http://localhost:3000/newgame', 'Content-Type': 'application/x-ndjson'}, (err, res) => {console.log(err, res)}
      // request({
      //   uri: 'http://localhost:3000/newgame',
      //   method: 'POST',
      //   data});


  //need this to only return array of objects to be sent in request


  //generate data (decide shape)
  //send one flat row of everything

  //send to endpoint
}

addGames();

// 
// fs.createReadStream('./data/elasicsearchData.json').pipe(request.post({uri: 'http://localhost:9200/_bulk', 'Content-Type': 'application/x-ndjson'}, (err, res) => {console.log(err, res)}))
    //  request({
    //     uri: 'http://localhost:9200/_bulk',
    //     method: 'POST',
    //     'Content-Type': 'application/json',
    //     data});

        // curl -XPOST 'localhost:9200/_bulk?pretty' -H 'Content-Type: application/json' -d'
        // { "index" : { "_index" : "test", "_type" : "type1", "_id" : "1" } }
        // { "field1" : "value1" }
        // { "delete" : { "_index" : "test", "_type" : "type1", "_id" : "2" } }
        // { "create" : { "_index" : "test", "_type" : "type1", "_id" : "3" } }
        // { "field1" : "value3" }
        // { "update" : {"_id" : "1", "_type" : "type1", "_index" : "test"} }
        // { "doc" : {"field2" : "value2"} }
        // '
        