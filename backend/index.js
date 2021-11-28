const express = require('express')
const app = express()
const cors = require('cors')
const {spawn} = require('child_process')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.post('/api/assembler', (req, res) => {

	const simulator = spawn('python3', ['../SimpleSimulator/simulator.py'])
	const assembler = spawn('python3', ['../Simple-Assembler/assembler.py'])

	let output = {assembler: [], simulator: {register_states: [], memory_dump: []}}

	assembler.stdin.write(req.body.code)
	assembler.stdin.end()

	assembler.on('spawn', () => {
		console.log("Assembler started")
	})

	assembler.on('error', (err) => {
		console.error('Failed to start Assembler.');
		res.status(500).end()
	})

	assembler.stdout.on('data', (data) => {
		output.assembler += data.toString()
	})

	assembler.stderr.on('data', (data) => {
		console.log(`ASSEMBLER STDERR: ${data.toString()}`)
		res.json({"error": data.toString().split("\n")})
	})

	simulator.on('spawn', () => {
		console.log("Simulator started")
	})

	simulator.on('error', (err) => {
		console.error('Failed to start Simulator.');
		res.status(500).end()
	})

	simulator.stdout.on('data', (data) => {
		// console.log(`SIMULATOR STDOUT: ${data.toString()}`)
		data.toString().split('\n').forEach(line => {
			if (line.split(' ').length > 1)
				output.simulator.register_states.push(line)
			else
				output.simulator.memory_dump.push(line)
		})
	})

	simulator.stderr.on('data', (data) => {
		// console.log(`SIMULATOR STDERR: ${data.toString()}`)
		output.simulator = data.toString().split("\n")
		res.status(500).end()
	})

	assembler.on('exit', code => {
		if (code == 0)
		{
			// console.log(`ASSEMBLER STDOUT: ${output.assembler}`)
			simulator.stdin.write(output.assembler)
			simulator.stdin.end()
			output.assembler = output.assembler.split('\n')
		}
	})

	simulator.on('exit', code => {
		if (code == 0)
			res.json(output)
		else
			res.status(500).end()
	})
})

app.post('/api/assembler', (req, res) => {
	res.send("Received request at assembler")

	const pythonProcess = spawn('python', [".."])
})

const unknownEndpoint = (req, res) => {
	res.status(404).json({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const PORT = process.env.port || 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
