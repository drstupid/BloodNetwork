 var express = require("express")
 var bodyParser = require("body-parser");
 var app = express()
 var path = require("path")
 var urlencodedParser = bodyParser.urlencoded({ extended: false })

 var registrationController = require("./registrationController.js")
 var db = require("./databaseController.js")
 registrationController.initialize(db)

 var passport = require('passport')
 var LocalStrategy = require('passport-local').Strategy

 app.use(express.static("src"))
 var session = require('express-session')
 app.use(session({ secret: 'AsSecretAsItGets' }))
 app.use(passport.initialize())
 app.use(passport.session())

 var bCrypt = require("bcrypt-nodejs")
 var createHash = function(password){
     return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
 }
 var isValidPassword = function(user, password){
     return bCrypt.compareSync(password, user.password);
}

 passport.use('local', new LocalStrategy(
  function(phoneNumber, password, done) {
    var user = db.findUser(phoneNumber)
    if (!user || !isValidPassword(user, password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
    }

    return done(null, user);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.phoneNumber);
});

passport.deserializeUser(function(phoneNumber, done) {
    var user = db.findUser(phoneNumber)
    if (user) {
        done(null, user)
    } else {
        done (null, false)
    }
});

 app.listen(process.env.PORT || 8080, function(){
   console.log("Server started...")
 })

 app.get("/", function(request, response) {
   response.sendFile("index.html", {root: path.join(__dirname, "../src")})
 })

// Process registration and display phone nr validation
app.post("/registrationAction", urlencodedParser, function(request, response) {
  if (!request.body) return response.sendStatus(400)

  var phoneNumber = request.body.phoneNumber
  console.log("post from registrationAction: " + phoneNumber)
  registrationController.registerPhoneNumber(phoneNumber, function(err, message) {
    if(!err) {
      response.status(200).json({"phoneNumber": phoneNumber})
    } else {
      console.log("phone number registration failed '" + message + "'");
      response.status(500).json({error: message})
    }
  })
})

// Process phone number validation with validation code
app.post("/phoneValidationAction", urlencodedParser, function(request, response) {
  if (!request.body) return response.sendStatus(400)

  var validationCode = request.body.validationCode
  var phoneNumber = request.body.phoneNumber
  console.log("post from phoneValidationAction: " + validationCode)
  var isValid = registrationController.validatePhoneNumber(phoneNumber, validationCode)
  if (isValid) {
    console.log("validation code IS valid")
    response.status(200).json({"phoneNumber": phoneNumber, "validationCode" : validationCode})
  } else {
    console.log("validation code NOT valid")
    response.status(500).send({erorr: "Codul introdus nu este valid."})
  }
})

app.get("/centers", function(request, response) {
    response.json(db.allCenters())
})

app.get("/news", function(request, response) {
  response.json(db.allNews())
})

app.post("/insertNewsAction", urlencodedParser, function(request, response) {
  if (!request.body) return response.sendStatus(400)

  var title = request.body.title
  var body = request.body.body
  db.insertNews(title, body)
  response.status(200).json({"status": "news saved"});
})

app.post("/scheduleSMSAlertAction", urlencodedParser, function(request, response) {
  if (!request.body) return response.sendStatus(400)

  var body = request.body.body
  // call schedule method
  response.status(200).json({"message": "sms alert scheduled"})
})

app.post("/instantSMSAlertAction", urlencodedParser, function(request, response) {
  if (!request.body) return response.sendStatus(400)

  var bloodType = request.body.bloodType
  var body = request.body.body
  // call send sms with blood type
  response.status(200).json({"message": "sms alert sent"})
})

/// Pass this MIDDLEWARE to the POST that handles login
var authenticate = passport.authenticate('local', { successRedirect: '/admin', failureRedirect: '/login' })

/// Pass this MIDDLEWARE to any page that needs to be protected by authentication
var isAuthenticated = function (request, response, next) {
  if (request.isAuthenticated())
    return next();
  response.redirect('/login');
}

app.get("/login", function(request, response) {
  response.sendFile("login.html", {root: path.join(__dirname, "../src")})
})

app.post("/login", urlencodedParser, authenticate)

app.get("/admin", urlencodedParser, isAuthenticated, function(request, response) {
    if (request.user.isAdmin) {
        response.sendFile("admin.html", {root: path.join(__dirname, "../src")})
    } else {
        response.redirect('/');
    }
})

app.post('/logout', function(request, response){
  request.logout();
  response.redirect('/login');
});

app.get('/insertAdmin', function (request, response) {
    var password = createHash("admin")
    var phoneNumber = "1234"
    db.insertUser({password: password, phoneNumber: phoneNumber, isAdmin: true, isVerified: true})
    response.redirect('/login');
})

// Schedule recurring notifications
var notificationController = require("./notificationController")
notificationController.initialize(db)
notificationController.startNotifying()
