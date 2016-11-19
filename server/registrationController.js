var Pattern = require('pattern')

// Twilio Credentials
var accountSid = 'AC418dbf5deeaa09cea250845a5e3e7a9c';
var authToken = 'afe8b65f2673926c3acb87a8d3f4d457';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

function getValidationCode() {
    var text = "";
    var possible = "0123456789";

    for( var i=0; i < 4; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function sendMessage(phoneNumber, validationCode, completion) {
/*
  client.messages.create({
      to: phoneNumber,
      from: "+18584616763",
      body: "Cod de validare: " + validationCode,
  }, function(err, response) {
      completion(err, response)
      if (!err) {
          console.log("Message sent: " + JSON.stringify(response))
      } else {
          console.log(JSON.stringify(err))
      }
  });
  */
}

var db

module.exports = Pattern.extend({

    initialize: function (database) {
        db = database
    },

    registerPhoneNumber: function (phoneNumber, completion) {
        var validationCode = getValidationCode()

        if (db.insertUser({phoneNumber: phoneNumber, validationCode: validationCode, isVerified: false})) {
          sendMessage(phoneNumber, validationCode, function (err, response) {
            if (err) {
              completion(err, "Va rugam sa verificati numarul de telefon introdus.")
            } else {
              completion(null, null)
            }
          })
        } else {
            var user = db.findUser(phoneNumber)
            if (user.isVerified) {
              console.log("User with phone number: " + phoneNumber + " already registered")
              completion("error", "Numarul de telefon " + phoneNumber + " a fost deja inregistrat si validat.")
            } else { // resend validation code
              sendMessage(phoneNumber, validationCode, function (err, response) {
                if (err) {
                  completion(err, "Error :) Va rugam sa verificati numarul de telefon introdus.")
                } else {
                  completion(null, null)
                }
              })
            }
        }
    },

    unregisterPhoneNumber: function (phoneNumber) {
        db.deleteUser(phoneNumber)
    },

    validatePhoneNumber: function (phoneNumber, validationCode) {
        var user = db.findUser(phoneNumber)

        if (user.verificationCode == validationCode) {
            user.isVerified = true
            db.updateUser(user)
            return true
        }

        return false
    }

});
