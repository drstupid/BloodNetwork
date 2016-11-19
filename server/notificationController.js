var Pattern = require('pattern')
var schedule = require('node-schedule')
var twilio = require("./twilioController")

var notificationJob
var db
var recurringNotificationMessage = null

function currentDateInMilliseconds() {
  var d = new Date();
  return d.getTime();
}

function notifyUsers() {
    if (recurringNotificationMessage == null) return

    var users = db.allUsers()
    var currentTime = currentDateInMilliseconds()

    var numberOfNotificationsSent = 0
    users.forEach(function(user) {
        if (currentTime - user.lastNotified > 80000) {
            user.lastNotified = currentTime
            db.updateUser(user)
            numberOfNotificationsSent = numberOfNotificationsSent + 1

            twilio.sendMessage(user.phoneNumber, recurringNotificationMessage, function() {})
        }
    })

    console.log(numberOfNotificationsSent + ' SMS notifications sent')
}

module.exports = Pattern.extend({

    initialize: function(database) {
        db = database
    },

    startNotifying: function() {
        var rule = new schedule.RecurrenceRule()
        rule.hour = 10

        notificationJob = schedule.scheduleJob("*/10 * * * * *", notifyUsers)
        // notificationJob = schedule.scheduleJob(rule, notifyUsers)
    },

    stopNotifying: function() {
        notificationJob.cancel()
    },

    setRecurringNotificationMessage: function(message) {
        recurringNotificationMessage = message
    },

    sendInstantNotification: function(bloodType, message) {
        var users = db.allUsers()

        var numberOfNotificationsSent = 0
        users.forEach(function(user) {
            if (user.bloodType == bloodType) {
                user.lastNotified = currentDateInMilliseconds()
                db.updateUser(user)
                numberOfNotificationsSent = numberOfNotificationsSent + 1

                twilio.sendMessage(user.phoneNumber, message, function() {})
            }
        })

        console.log(numberOfNotificationsSent + ' instant SMS notifications sent')
    }

})
