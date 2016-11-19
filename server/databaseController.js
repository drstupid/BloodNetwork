var Loki = require("lokijs");
var Pattern = require('pattern')

var db = new Loki('loki.json')
db.loadDatabase({}, function () {
    console.log("Database prepared");
});

// Define database collections
var users
var centers

module.exports = Pattern.extend({
    // Collections getters
    usersCollection: function () {
        if (users == null) {
            users = db.getCollection('users');
            if (users == null) {
                users = db.addCollection('users')
            }
        }

        return users
    },

    centersCollection: function () {
        if (centers == null) {
            centers = db.getCollection('centers')
            if (centers == null) {
                centers = db.addCollection('centers')

                var centersJSON = require("./centers.json")
                for (var city in centersJSON) {
                    centersJSON[city].city = city
                    centers.insert(centersJSON[city])
                }
                db.saveDatabase()
            }
        }

        return centers
    },

    // Centers
    allCenters: function () {
        return this.centersCollection().find({})
    },

    findCenter: function (city) {
        return this.centersCollection().find({city: city})
    },

    // Users
    insertUser: function (user) {
        var phoneNumber = user.phoneNumber
        var existingUsers = this.usersCollection().find({phoneNumber: phoneNumber})
        if (existingUsers.length == 0) {
            this.usersCollection().insert(user)
            db.saveDatabase()
            return true
        }

        return false
    },

    deleteUser: function (phoneNumber) {
        var user = this.findUser(phoneNumber)
        this.usersCollection().remove(user)
        db.saveDatabase()
    },

    updateUser: function (user) {
        this.usersCollection().update(user)
        db.saveDatabase()
    },

    findUser: function (phoneNumber) {
        return this.usersCollection().findOne({phoneNumber: phoneNumber})
    },

    allUsers: function () {
        return this.usersCollection().find({})
    }

});
