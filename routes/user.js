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
  database("users")
  //where a row in the column nursecode is equal to the one the User inputs
    .where({ nursecode: oUser.nursecode})
    //limit to 1
    .first()
    //when the User object is found we use a promise that holds a function with the response
    //the response is a json object
    //to check what the response is I did a console.log to check what type is that response
    .then(function (response) {
      //if the json object is type undefined
      if (response == undefined) {
         //if the user object already exists return true
        console.log("This nursecode already exists!");
        return true;
      } else {
         //if the user object does not exist, return false AND insert nursecode in the db
        console.log("it hit the else statement line 60");
        return false;
      }
    });

  // bcrypt.hash(password, 10)
  // .then(hashedPassword => {
  //    return database("users").insert({
  //       username: nurseCode,
  //       password_hash: hashedPassword,
  //       //role: role

  //    })
  //    .returning(["id", "username"])

  // .then(users => {
  //    response.json(users[0])
  // })
  // .catch(error => next(error))

  //})
});

//this function will retuirn a boolean
//the true condition is when the nursecode is found in the db
//the false condition is when the nursecode is NOT found in the db

function checkDuplicateNurseCode(sNurseCode) {

}

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
