 var express = require("express")
 var bodyParser = require("body-parser");
 var app = express()
 var path = require("path")
 var urlencodedParser = bodyParser.urlencoded({ extended: false })

 var registrationController = require("./registrationController.js")
 var db = require("./databaseController.js")
 registrationController.initialize(db)

 app.use(express.static("src"))
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
