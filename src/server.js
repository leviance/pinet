const express = require('express')
const connectDB = require('./config/connectDB')
const config_view_engine = require('./config/config_view_engine')
const init_routes = require('./routes/web')
const bodyParser = require('body-parser')
const config_session = require('./config/config_session')

const app = express()

// connect mongoDB
connectDB();

// config view engine
config_view_engine(app)

// add body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// config session
config_session(app)

// config routes
init_routes(app)

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Run success at http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
})