const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const assemblerRouter = require('./controllers/assembler')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.static(path.join(__dirname, '../frontend/build')))

app.use('/api/assembler', assemblerRouter)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
})

app.use(middleware.unknownEndpoint)

module.exports = app
