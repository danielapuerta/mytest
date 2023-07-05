const express = require('express')
const router = express.Router()
const database = require('../db/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.post("/users", ( request, response ) => {
    const { user } = request.body
    bcrypt.hash(user.password, 12)
        .then(hashed_password => {
           return database("users")
                .insert({
                    username: user.username,
                    password_hash: hashed_password
                }) 
                .returning("*")
                .then(users => {
                    const user = users[0]
                    response.json({ user })
                }).catch(error => {
                    response.json({ error: error.message })
                })
        })
})

module.exports = router;