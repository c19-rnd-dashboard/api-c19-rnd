require('dotenv').config()
const express = require('express')
const app = express()

const PORT = process.env.PORT || 4000


app.get('/', function (req, res) {
  res.send('hello world 2')
})

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})