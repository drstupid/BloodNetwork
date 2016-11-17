var Loki = require("lokijs");
var Pattern = require('pattern')

var db = new Loki('loki.json')
db.loadDatabase({}, function () {
    console.log("Database prepared");
});

// Define database collections
var users

module.exports = Pattern.extend({

    usersCollection: function () {
        if (users == null) {
            users = db.getCollection('users');
            if (users == null) {
                users = db.addCollection('users')
            }
        }

        return users
    },

    insertUser: function (phoneNumber, verificationCode, isVerified) {
        var existingUsers = this.usersCollection().find({phoneNumber: phoneNumber})
        if (existingUsers.length == 0) {
            this.usersCollection().insert({phoneNumber: phoneNumber, verificationCode: verificationCode, isVerified: isVerified})
            db.saveDatabase()
            return true
        }

        return false
    },

    findUser: function (phoneNumber) {
        return this.usersCollection().find({phoneNumber: phoneNumber})
    },

    allUsers: function () {
        return this.usersCollection().find({})
    }

});
