require('dotenv').config()
const express = require('express')
const app = express()
const { getSheet } = require('./sheetsApi')

const PORT = process.env.PORT || 4000

app.get('/', function (req, res) {
  getSheet({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:F',
  }).catch(error => {
    res.status(500).send({
      message: 'Failed to open the sheet',
      error,
    })
  }).then(rows => {
    const data = rows.map((row) => ({
      name: row[0],
      major: row[4],
      extraActivity: row[5],
    }));
    res.json(data)
  })

})

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})


