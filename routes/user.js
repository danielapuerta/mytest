const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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


 router.post("/api/login", authenticateUser, (request, response, next) => {
   //create an user object to req body from hbs
   const oUser  = request.body
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
               return jwt.sign(oUser, secret, (error, token) => {
                  response.status(200).json({token})
               })
            }
         })
      }
   })
})

function authenticateUser(request, response, next) {
   const token = request.headers.authorization.split(" ")[1]
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

function verifyjwt(request,response,next){
   const oUser  = request.body
   const token = req.headers['authorization']
   if(!token) return res.status(401).json('Unauthorized user')
 
  try{
       const decoded = jwt.verify(token,secret);
       req.user = decoded
       next()
 
  }catch(e){
   res.status(400).json('Token not valid')
  }
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