const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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



module.exports = router;