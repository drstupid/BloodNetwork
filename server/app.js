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
 app.use(session({ secret: 'keyboard cat' }))
 app.use(passport.initialize())
 app.use(passport.session())

 var bCrypt = require("bcrypt-nodejs")
 var createHash = function(password){
     return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
 }
 var isValidPassword = function(admin, password){
     return bCrypt.compareSync(password, admin.password);
}

 passport.use('local', new LocalStrategy(
  function(username, password, done) {
    var admin = db.findAdmin(username)
    console.log(JSON.stringify(admin))
    if (!admin || !isValidPassword(admin, password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
    }

    return done(null, admin);
  }
));

passport.serializeUser(function(user, done) {
    console.log("serializing User: " + user)
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    console.log("deserializing user: "+ username)
    var admin = db.findAdmin(username)
    if (admin) {
        console.log("deserialized")
        done(null, admin)
    } else {
        console.log("deserialized fail")
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

/// Pass this MIDDLEWARE to the POST that handles login
var authenticate = passport.authenticate('local', { successRedirect: '/logged', failureRedirect: '/muie' })

/// Pass this MIDDLEWARE to any page that needs to be protected by authentication
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/muie');
}
