import express from 'express'

const app = express()

app.get('/', async (req, res) => {
  res.send("hello bro")
})

app.listen(3001, ()=>{
  console.log("Run success")
})