const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors')
var path = require('path');
const cookieParser = require('cookie-parser')

const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')

//define my server as 'app'
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(cookieParser())


const port = 5000

app.use(userRouter)
app.use(indexRouter)

app.listen(port, () => console.log(`listening at port ${port}`))


