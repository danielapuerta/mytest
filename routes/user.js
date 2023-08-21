const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SECRET = "secret"
//const {verifyToken} = require("../controllers/auth.controller")

//req post register user

//create route for registering
router.post("/api/register", (request, response, next) => {
   //const role = 'basic-user'

   bcrypt.hash(request.body.password, 10)
   .then(hashedPassword => {
      return database("users").insert({
         username: request.body.username,
         password_hash: hashedPassword,
         //role: role
      })
      .returning(["id", "username"])
      .then(users => {
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


 router.post("/login", (request, response, next) => {
   database("users")
   .where({username: request.body.username})
   .first()
   .then(user => {
      if(!user){
         response.status(401).json({
            error: "No user by that name"
         })
      }else{
         return bcrypt
         .compare(request.body.password, user.password_digest)
         .then(isAuthenticated => {
            if(!isAuthenticated){
               response.status(401).json({
                  error: "Unauthorized Access!"
               })
            }else{
               return jwt.sign(user, SECRET, (error, token) => {
                  response.status(200).json({token})
               })
            }
         })
      }
   })
})



module.exports = router;