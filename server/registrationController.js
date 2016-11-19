var Pattern = require('pattern')
var twilio = require("./twilioController")

function getValidationCode() {
    var text = "";
    var possible = "0123456789";

    for( var i=0; i < 4; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function sendMessage(phoneNumber, validationCode, completion) {
    var message = "Cod de validare: " + validationCode
    twilio.sendMessage(phoneNumber, message, completion)
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

        if (user.validationCode == validationCode) {
            user.isVerified = true
            db.updateUser(user)
            return true
        }

        return false
    }

});
