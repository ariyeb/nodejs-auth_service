const express = require('express')
const cors = require('cors')
require('./db/mongoose');
const userRouter = require('./routers/user');
const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(cors())
app.use(userRouter)

app.listen(port, () => {
    console.log('Server connected, port: ' + port)
})
