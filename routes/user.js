const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//this is the secret key also known as the token
const secret =  "SECRET"
//const verifyjwt = require("../controllers/auth.controller")


//create route for registering
router.post("/api/register",  (request, response, next) => {
   //const role = 'basic-user'
   const oUser = request.body

      //console.log("This is the user object " + oUser)
      console.log(oUser)
      console.log(oUser.nursecode)
      

   //console.log("This data" + oUser )

   //let bUserExists = checkDuplicateNurseCode(oUser.nursecode);

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

function checkDuplicateNurseCode(sNurseCode){
   database('users').where({nursecode : sNurseCode}).first()
   .then((oUser)=>{
      if(oUser){
         console.log("this nurse code: " + oUser + " is already in use")
         return
      }
      next();
   })
}



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
                  //create the cookie
                  //store the the token in the cookie
                  response.cookie('x-access-token', token)
                  //create the token by storing it in token
                  response.status(200).json({token})
               })
            }
         })
      }
   })
})



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