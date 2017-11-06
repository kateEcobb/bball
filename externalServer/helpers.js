// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set the region from the JSON file
AWS.config.loadFromPath('./config/config.json');

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var sendToQ = (req, res, next) => {
  // var body

  // req.body
  var params = {
    DelaySeconds: 10,
    MessageBody: JSON.stringify(req.body),
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/630349627985/playerRating"
   };
   
   sqs.sendMessage(params, function(err, data) {
     if (err) {
       console.log("Error", err);
       req.body.msgStatus = 'error sending message'
       next();
     } else {
       console.log("Success", data.MessageId);
       req.body.msgStatus = 'message sent'
       next();
     }
   });

}


// sendToQ()
module.exports.sendToQ = sendToQ;
