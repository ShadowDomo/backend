/* Entry point into server. */

require('dotenv').config()
const cors = require('cors')
const express = require('express')
const router = require('./routes.js')
const PORT = process.env.PORT

// init server
const app = express()
app.use(express.json())
app.use(cors())

app.use('/api', router)
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

