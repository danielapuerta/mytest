const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors')
var path = require('path');

const userRouter = require('./routes/user')

const app = express();

app.use(bodyParser.json())
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index', { title: 'SeniorCare' });
  });

const port = 5000

app.listen(port, () => console.log(`listening at port ${port}`))

app.use(userRouter)