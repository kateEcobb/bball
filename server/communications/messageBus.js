// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set the region from the JSON file
AWS.config.loadFromPath('./server/config/config.json');

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

/*
var params = {
  QueueName: 'SQS_QUEUE_NAME'
};

sqs.getQueueUrl(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.QueueUrl);
  }
});

*/


var sendToAnalytics = (body) => {
  console.log(body)
  var params = {
    DelaySeconds: 10,
    // MessageAttributes: {
    //   "Title": {
    //     DataType: "String",
    //     StringValue: "The Whistler"
    //    },
    //   "Author": {
    //     DataType: "String",
    //     StringValue: "John Grisham"
    //    },
    //   "WeeksOn": {
    //     DataType: "Number",
    //     StringValue: "6"
    //    }
    //   },
    MessageBody: JSON.stringify(body),
    QueueUrl: "https://sqs.us-west-1.amazonaws.com/455865650469/HRThesisNBAJerseys"
   };
   
   sqs.sendMessage(params, function(err, data) {
     if (err) {
       console.log("Error", err);
     } else {
       console.log("Success", data.MessageId);
     }
   });


}
sendToAnalytics();

/*
var sendToAnalytics = (attributes) => {
  var params = {
    DelaySeconds: 10,
    MessageAttributes: attributes,
    MessageBody: "Player Ratings",
    QueueUrl: "https://sqs.us-west-1.amazonaws.com/455865650469/HRThesisNBAJerseys"
   };
   
   sqs.sendMessage(params, function(err, data) {
     if (err) {
       console.log("Error", err);
     } else {
       console.log("Success", data.MessageId);
     }
   });


}
*/

module.exports.sendToAnalytics = sendToAnalytics;
