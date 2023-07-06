var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'SeniorCare' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'SeniorCare' });
});

router.get('/residentsList', function(req, res, next) {
  res.render('residentsList', { title: 'SeniorCare' });
});

module.exports = router;
