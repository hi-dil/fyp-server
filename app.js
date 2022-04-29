require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const connectFirebase = require('./db/connect')

const notFoundMiddleware = require('./middleware/not_found')
const errorMiddleware = require('./middleware/error_handler')

// calling db
const db = connectFirebase.database()
const ref = db.ref('/StorageData')

// calling router
const storageRouter = require('./routes/storage')

// middleware
app.use(express.json())

// routes

app.get('/', (req, res) => {
    res.send('<h1>FoodBank API</h1><a href="/api/v1/storage">Foodbank Storage route</a>')
})

app.use('/api/v1/storage', storageRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 5000

const start = async() => {
    try {
        await connectFirebase
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()