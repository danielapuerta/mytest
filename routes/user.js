const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SECRET = "secret"
const verifyjwt = require("../controllers/auth.controller")


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


 router.post("/api/login", verifyjwt, (request, response, next) => {
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

// router.get("/verify", (request, response, next) => {
//    //const token = request.headers.authorization.split(" ")[1]
//    const token = request.body.token
//    jwt.verify(token, SECRET, (error, decodedToken) => {
//       if(error){
//          response.status(401).json({
//             message: "Unauthorized Access!"
//          })
//       }else{
//          response.status(200).json({
//             id: decodedToken.id,
//             username: decodedToken.username
//          })
//       }
//    })
// })


module.exports = router;