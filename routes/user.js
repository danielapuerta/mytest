const express = require("express");
const router = express.Router();
const database = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//this is the secret key also known as the token
const secret = "SECRET";
//const verifyjwt = require("../controllers/auth.controller")

//create route for registering
router.post("/api/register", (request, response, next) => {
  //create a var that holds the User object
  const oUser = request.body;

  //select from the table users
   //where a row in the column nursecode is equal to the one the User inputs
    //limit to 1
   //when the User object is found we use a promise that holds a function with the response
    //the response is a json object
    //to check what the response is I did a console.log to check what type is that response
   database("users")
    .where({ nursecode: oUser.nursecode })
    .first()
    .then(function (response) {
      //if the json object is type undefined
      if (response != undefined) {
        //if the user object already exists return true
        console.log("This nursecode already exists!");
        return true;
      } else {
        //if the user object does not exist, return false AND create User in the db
        console.log("it hit the else statement line 33");
        //use bcrypt to hash the password using request.body
        //.then is a promise to create and store the password
        bcrypt.hash(oUser.password, 8).then(function(hash){
          console.log('this is the hashed pass ' + hashedPass)
        })
        // insert({nursecode: oUser.nursecode, password_hash: hashedPass}).then(function(oUser){
        //   console.log('A new user has been created sucessfully ' + oUser)
        // })
        return false
    
      }
    });


});



router.get("/users", (request, response, next) => {
  database("users").then((users) => {
    response.json(users);
  });
});

router.post("/api/login", (request, response, next) => {
  //create an user object to req body from hbs
  const oUser = request.body;
  //console.log(oUser)
  //select users table from db
  database("users")
    //where the row username in db matches the nurseCode input by user
    .where({ username: oUser.nurseCode })
    //limit to 1
    .first()
    //store the object in a Promise
    .then((retrievedUser) => {
      if (!retrievedUser) {
        response.status(401).json({
          error: "No user by that name",
        });
      } else {
        return Promise.all([
          bcrypt.compare(oUser.password, retrievedUser.password_hash),
          Promise.resolve(retrievedUser),
        ]).then((isAuthenticated) => {
          if (!isAuthenticated) {
            response.status(401).json({
              error: "Unauthorized Access!",
            });
          } else {
            //create a token with 3 parameters
            return jwt.sign(oUser, secret, (error, token) => {
              //create the cookie
              //store the the token in the cookie
              response.cookie("x-access-token", token);
              //create the token by storing it in token
              response.status(200).json({ token });
            });
          }
        });
      }
    });
});

//route to create a resident
router.post("/api/addNewResident", (request, response, next) => {
  const residentsObj = request.body;
  database("Residents")
    .insert({
      fullName: residentsObj.fullName,
      age: residentsObj.age,
      roomNumber: residentsObj.roomNumber,
    })
    .then((users) => {
      response.json(users);
    });
});

module.exports = router;
