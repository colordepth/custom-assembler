const express = require('express')
const app = express()
const cors = require('cors')
const assemblerRouter = require('./controllers/assembler')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.static(process.env.BUILD_DIR || 'frontend/build'))	// Relative to node process.

app.use('/api/assembler', assemblerRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
