var request = require('request');

var sendGame = (data) => {
  console.log(data.length)
  var waitTime = 0;
  console.log('vvvvv', data[0])
  // request.post({
  //         url: 'http://localhost:3000/newgame',
  //         // method: 'POST',
  //         headers: {'content-type': 'application/json'},
  //         // 'Content-Type': 'application/json',
  //         body: data[1]});
  data.forEach((val, i) => {
    
    if(i%50 === 0) {
      waitTime+=2000 
    }
    setTimeout(function() {
      request.post({
        url: 'http://localhost:2020/newgame',
        headers: {'content-type': 'application/json'},
        body: val});
      
    }, waitTime);

    
  })
}

module.exports.sendGame = sendGame;