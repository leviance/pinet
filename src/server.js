const express = require('express')
const connectDB = require('./config/connectDB')
const config_view_engine = require('./config/config_view_engine')
const init_routes = require('./routes/web')
const bodyParser = require('body-parser')
const config_session = require('./config/config_session')
const passport = require('passport')

// const app = express()

// // connect mongoDB
// connectDB();

// // config view engine
// config_view_engine(app)

// // add body parser
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// // config session
// config_session(app)

// // config routes
// init_routes(app)

// app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//   console.log(`Run success at http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
// })



var https = require('https')
var pem = require('pem')

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  
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

  // passport js
  app.use(passport.initialize());
  app.use(passport.session()); 

  // config routes
  init_routes(app)

  https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(3001)
})

