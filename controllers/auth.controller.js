const database = require("../db/db");
const jwt = require("jsonwebtoken");
const SECRET = "secret";

function verifyjwt(req,res,next){
  const token = req.headers['authorization']
  if(!token) return res.status(401).json('Unauthorized user')

 try{
      const decoded = jwt.verify(token,SECRET);
      req.user = decoded
      next()

 }catch(e){
  res.status(400).json('Token not valid')
 }
}

module.exports = verifyjwt
