const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SECRET = "secret"

//req post register user

//create route for registering
router.post("/api/register", (request, response, next) => {
   //hash the user pass 10 times salt
    bcrypt.hash(request.body.password, 10)

    //use a promise to store the hashed pass
    .then(hashedPassword => {
      // select database users and insert
       return database("users").insert({
         //user name where is = to username
          username: request.body.username,
          //store the hashed pass  (no need to do a body request)
          password_hash: hashedPassword
       })
       .returning(["id", "username"])
       //return from the users object 
       .then(users => {
         //limit to 1
          response.json(users[0])
       })
       .catch(error => next(error))
    })
 })

 router.get("/users", (request, response, next) => {
    database("users")
    .then(users => {
       response.json(users)
    })
 })


 router.post("/api/login", (request, response, next) => {
   //user logs in and first check is
   database("users")
   //select from the users table where username in db == to username from the request body 
   .where({username: request.body.username})
   .first()
   .then(retrievedUser  => {
      //if user is not found, send an error response
      if(!retrievedUser ){
         response.status(401).json({
            error: "No user by that name"
         })
      }else{
         //if it's found, compare the password from the req body with the hashed pass store in the db
         return bcrypt
         .compare(request.body.password, user.password_hash)
         //create a Promise where if is not Authenticated send an error response
         .then(isAuthenticated => {
            if(!isAuthenticated){
               response.status(401).json({
                  error: "Unauthorized Access!"
               })
            }else{
               //if it's authenticated, create and return a token with the user found
               return jwt.sign(payload, SECRET, (error, token) => {
                  response.status(200).json({token})
               })
            }
         })
      }
   })
})




module.exports = router;