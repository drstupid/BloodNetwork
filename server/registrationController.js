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

var db

module.exports = Pattern.extend({

    initialize: function (database) {
        db = database
    },

    registerPhoneNumber: function (phoneNumber, completion) {
        var validationCode = getValidationCode()

        if (db.insertUser(phoneNumber, validationCode, false)) {
            client.messages.create({
                to: phoneNumber,
                from: "+18584616763",
                body: "Cod de validare: " + validationCode,
            }, function(err, message) {
                completion(err, message)
                if (!err) {
                    console.log("Message sent: " + message)
                } else {
                    console.log(message)
                }
            });
        } else {
            console.log("User already in db")
            completion("", "Numarul de telefon introdus exista deja")
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
