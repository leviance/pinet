const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

let config_session = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ 
      url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      autoRemove: 'native'
    }),
    rolling: true,
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  }))
}

module.exports = config_session