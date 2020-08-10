const express = require('express')
const connectDB = require('./config/connectDB')
let test = require('./models/users.model')

const app = express()

// connect mongoDB
connectDB();

const host = 'localhost'
const port = 3001

app.get('/', (req, res) =>{
  // test create and insert data in data base
  test
  
  res.send("hello world")
})

app.listen(port, host, () => {
  console.log(`Run success at http://${host}:${port}`)
})