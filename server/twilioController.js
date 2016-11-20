var Pattern = require('pattern')

// Twilio Credentials
var accountSid = 'AC418dbf5deeaa09cea250845a5e3e7a9c';
var authToken = 'afe8b65f2673926c3acb87a8d3f4d457';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

module.exports = Pattern.extend({

    sendMessage: function (phoneNumber, message, completion) {
        client.messages.create({
            to: phoneNumber,
            from: "+18584616763",
            body: message,
        }, function(err, response) {
            completion(err, response)
            if (!err) {
                console.log("Message sent: " + JSON.stringify(response))
            } else {
                console.log(JSON.stringify(err))
            }
        });
    }
    
})
