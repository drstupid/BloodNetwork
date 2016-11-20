var Loki = require("lokijs");
var Pattern = require('pattern')

var db = new Loki('loki.json')
db.loadDatabase({}, function () {
    console.log("Database prepared");
});

function currentDateInMilliseconds() {
  var d = new Date();
  return d.getTime();
}

// Define database collections
var users
var centers
var news

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

    newsCollection: function () {
      if (news == null) {
        news = db.getCollection("news")
        if (news == null) {
          news = db.addCollection("news")
        }
      }

      return news
    },

    // Centers
    allCenters: function () {
        return this.centersCollection().find({}).map(function(center) {
            return {name: center.name, address: center.address, tel: center.tel, coords: center.coords, city: center.city}
        })
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
    },

    // News
    insertNews: function (title, body) {
      this.newsCollection().insert({title: title, date: currentDateInMilliseconds(), body: body})
      db.saveDatabase()
    },

    allNews: function () {
        return this.newsCollection().find({}).sort(function(obj1, obj2) {
            if (obj1.date === obj2.date) return 0
            if (obj1.date > obj2.date) return -1
            if (obj1.date < obj2.date) return 1
        }).map(function(news) {
            return {title: news.title, date: news.title, body: news.body, id: news.$loki}
        })
    },

    recentNews: function() {
        return this.allNews().filter(function(news, idx) {
            return (idx < 3)
        })
    }

});
