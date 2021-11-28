const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())


app.get('/', (req, res) => {
	res.send("Hello world")
})

app.post('/api/assembler', (req, res) => {
	res.send("Received request at assembler")
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const PORT = process.env.port || 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
