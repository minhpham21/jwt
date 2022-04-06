const express = require("express")
const db = require('./utils/db')
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const session = require('./utils/sesion')

dotenv.config({ path: './config/.env' });

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session);
app.get('/', (req, res) => {
    res.send("hello")
})

// route
const userRouter = require('./components/user')
app.use('/users', userRouter)
const authRouter = require('./components/auth')
app.use('/auth', authRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    db.connectDB()
});