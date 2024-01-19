var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const secret =  "SECRET"

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'SeniorCare' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'SeniorCare' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'SeniorCare' });
});

router.get('/residentsList', authenticateUser, function(req, res, next) {
  
  res.render('residentsList', { title: 'SeniorCare' });
});



function authenticateUser(request, response, next) {
  let token = request.cookies["x-access-token"];
  console.log(token)
  jwt.verify(token, secret, (error, decodedToken) => {
     if(error){
        response.status(401).json({
           message: "Unauthorized Access!"
        })
     }else{
      //executes the next middleware 
      next()
     }
  })
}

module.exports = router;
