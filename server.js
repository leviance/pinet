import express from 'express'

const app = express()

const host = 'localhost'
const port = 3001

app.get('/', (req, res) =>{
  res.send("hello world")
})

app.listen(port, host, () => {
  console.log(`Run success at http://${host}:${port}`)
})