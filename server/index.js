// var express = require('express');
// var app = express();

// app.get('/', function(req, res){
//   res.send('hello world');
// });

// app.listen(3000);

var elasticsearch = require('elasticsearch');
var generate = require('../data/generator.js')
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

// var elasticsearchInsert = (info) => {
//   // console.log('data>>>>>>>>>>', dataArray)
//   client.bulk({
//     body: info
//   }, function (err, resp) {
//     console.log('error>>>>>>>>', err)
//     console.log('response>>>>>>>>', resp)
//   });
// }

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
    var dataArray = generate.creator();
    // client.bulk({
    //   body: dataArray
    // }, function (err, resp) {
    //   console.log('error>>>>>>>>', err)
    //   console.log('response>>>>>>>>', resp)
    // });
  }
});
// client.indices.delete({
//   index: 'test_index',
//   ignore: [404]
// }).then(function (body) {
//   // since we told the client to ignore 404 errors, the
//   // promise is resolved even if the index does not exist
//   console.log('index was deleted or never existed');
// }, function (error) {
//   // oh no!
// });

// var dataArray = generate.creator(elasticsearchInsert);

/*

body: [
    // action description
    { index:  { _index: 'firsttry', _type: 'firsttrygame',} },
     // the document to index
    { gameDate: '2017-08-01 10:23:54',
      hometeam: 'Minnesota Timberwolves',
      awayTeam: 'Chicago Bulls',
      firstName: 'Nemanja',
      lastName: 'Bjelica',
      playType: 'miss',
      playLength: 11,
      points: 0,
      homeScore: 0,
      awayScore: 0
    }*/