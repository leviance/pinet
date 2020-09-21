const app = require('express')()
const server = require('http').createServer(app)
const connectDB = require('./config/connectDB')
const config_view_engine = require('./config/config_view_engine')
const init_routes = require('./routes/web')
const bodyParser = require('body-parser')

const session = require('./config/config_session')
const passport = require('passport')

const config_socket_io = require('./config/config_socket_io')
const io = require('socket.io')(server)
const init_socket_io = require('./socket_io/index')


// connect mongoDB
connectDB();

// config session
session.config(app)

// config view engine
config_view_engine(app)

// add body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// passport js
app.use(passport.initialize());
app.use(passport.session()); 

// config routes
init_routes(app)

// config for socket.io
config_socket_io(io,app, session)
init_socket_io(io)

server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Run success at http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
})



// var https = require('https')
// var pem = require('pem')

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  
//   const app = express()

//   // connect mongoDB
//   connectDB();

//   // config view engine
//   config_view_engine(app)

//   // add body parser
//   app.use(bodyParser.urlencoded({ extended: true }))
//   app.use(bodyParser.json())

//   // config session
//   config_session(app)

//   // passport js
//   app.use(passport.initialize());
//   app.use(passport.session()); 

//   // config routes
//   init_routes(app)

//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(3001)
// })

