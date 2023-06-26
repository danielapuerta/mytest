const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors')
const userRouter = require('./routes/user')

const app = express();

app.use(bodyParser.json())
app.use(cors())

const port = 5000

app.use(userRouter)

app.listen(port, () => console.log(`listening at port ${port}`))