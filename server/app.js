 var express = require("express")
 var bodyParser = require("body-parser");
 var app = express()
 var path = require("path")
 var urlencodedParser = bodyParser.urlencoded({ extended: false })

 var registrationController = require("./registrationController.js")
 var db = require("./databaseController.js")
 registrationController.initialize(db)

 app.listen(process.env.PORT || 8080, function(){
   console.log("Server started...")
 })

 app.get("/", function(request, response) {
   response.sendFile("index.html", {root: path.join(__dirname, "../src")})
 })

// Dispaly registration form
 app.get("/registrationForm", function(request, response) {
   response.sendFile("registrationForm.html", {root: path.join(__dirname, "../src")})
 })

// Process registration and display phone nr validation
app.post("/registrationAction", urlencodedParser, function(request, response) {
  if (!request.body) return response.sendStatus(400)

  var phoneNumber = request.body.phoneNumber
  console.log("post from registrationAction: " + phoneNumber)
  registrationController.registerPhoneNumber(phoneNumber, function(err, message) {
    if(!err) {
      response.sendFile("phoneNumberValidation.html", {root: path.join(__dirname, "../src")})
    } else {
      //TODO: replace
      console.log("phone number registration failed")
      response.status(500).send({erorr: "phone number registration failed"})
    }
  })
})

// Process phone number validation with validation code
app.post("/phoneValidationAction", urlencodedParser, function(request, response) {
  if (!request.body) return response.sendStatus(400)

  var validationCode = request.body.validationCode;
  console.log("post from phoneValidationAction: " + validationCode)
  var isValid = registrationController.validatePhoneNumber("+40742128415", validationCode)
  if (isValid) {
    console.log("validation code is valid")
    response.redirect("/")
  } else {
    console.log("validation code not valid")
    response.status(500).send({erorr: "validation code not valid"})
  }
})

app.get("/centers", function(request, response) {
    response.json(db.allCenters())
})
