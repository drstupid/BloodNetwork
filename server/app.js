 var express = require("express")
 var app = express()
 var path = require("path")

 app.listen(8080, function(){
   console.log("Server started...")
 })

 app.get("/", function(request, response) {
   response.sendFile("index.html", {root: path.join(__dirname, "../src")})
 })
