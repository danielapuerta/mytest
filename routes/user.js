const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SECRET = "secret"

//req post register user
router.post("/api/register", (request, response, next) => {
    bcrypt.hash(request.body.password, 10)
    .then(hashedPassword => {
       return database("users").insert({
          username: request.body.username,
          password_hash: hashedPassword
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

 router.post("/api/authen/login", (request, response, next) => {
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
         .compare(request.body.password, user.password_hash)
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