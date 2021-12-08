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

app.use(middleware.unknownEndpoint)

module.exports = app
