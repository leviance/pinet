const express = require('express')
const connectDB = require('./config/connectDB')
const config_view_engine = require('./config/config_view_engine')

const app = express()

// connect mongoDB
connectDB();

// config view engine
config_view_engine(app)

app.get('/', async (req, res) =>{
  res.render('./home_page/index')
})

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Run success at http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
})