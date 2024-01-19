const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//this is the secret key also known as the token
const secret =  "SECRET"
//const verifyjwt = require("../controllers/auth.controller")


//create route for registering
router.post("/api/register", (request, response, next) => {
   //const role = 'basic-user'

   bcrypt.hash(request.body.password, 10)
   .then(hashedPassword => {
      return database("users").insert({
         username: request.body.nurseCode,
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


 router.post("/api/login", (request, response, next) => {
   //create an user object to req body from hbs
   const oUser  = request.body
   //console.log(oUser)
   //select users table from db
   database("users")
   //where the row username in db matches the nurseCode input by user
   .where({username: oUser.nurseCode})
   //limit to 1 
   .first()
   //store the object in a Promise
   .then(retrievedUser  => {
      if(!retrievedUser ){
         response.status(401).json({
            error: "No user by that name"
         })
      }else{
         return Promise.all([
            bcrypt.compare(oUser.password, retrievedUser.password_hash),
            Promise.resolve(retrievedUser)
         ]).then(isAuthenticated => {
            if(!isAuthenticated){
               response.status(401).json({
                  error: "Unauthorized Access!"
               })
            }else{
               //create a token with 3 parameters
               return jwt.sign(oUser, secret, (error, token) => {
                  console.log('this is line 67')
                  //create the cookie
                  let options = {
                     maxAge: 1000 * 60 * 60, // would expire after 60min
                     httpOnly: true, // The cookie only accessible by the web server
                     signed: true // Indicates if the cookie should be signed                      
                  }
                  //store the the token in the cookie
                  response.cookie('x-access-token', token)
                  console.log('this is line 75')
                  //create the token by storing it in token
                  response.status(200).json({token})
                  console.log('this is line 77')
               })
            }
         })
      }
   })
})

function authenticateUser(request, response, next) {
   let token = request.headers["x-access-token"];
   jwt.verify(token, secret, (error, decodedToken) => {
      if(error){
         response.status(401).json({
            message: "Unauthorized Access!"
         })
      }else{
         response.status(200).json({
            id: decodedToken.id,
            username: decodedToken.username
         })
      }
   })
}



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

//route to create a resident
router.post("/api/addNewResident", (request, response, next) => {
   const residentsObj = request.body
   database("Residents").insert({
      fullName: residentsObj.fullName,
      age: residentsObj.age,
      roomNumber: residentsObj.roomNumber
   })
   .then(users => {
      response.json(users)
   })
})





module.exports = router;