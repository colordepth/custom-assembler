const assemblerRouter = require('express').Router()
const logger = require('../utils/logger')
const {spawn} = require('child_process')
const path = require('path')

assemblerRouter.post('/', (req, res) => {
	const simulator = spawn('python3', [path.join(__dirname, '../../SimpleSimulator/simulator.py')])
	const assembler = spawn('python3', [path.join(__dirname, '../../Simple-Assembler/assembler.py')])

	let output = {
		assembler: [],
		simulator: {
			register_states: [],
			memory_dump: []
		}
	}

	assembler.stdin.write(req.body.code)
	assembler.stdin.end()

	assembler.on('error', err => {
		logger.error('Failed to start Assembler.');
		res.status(500).end()
	})

	assembler.stdout.on('data', data => {
		output.assembler += data.toString()
	})

	assembler.stderr.on('data', data => {
		// logger.info(`ASSEMBLER STDERR: ${data.toString()}`)
		res.json({"error": data.toString().split("\n")})
		simulator.kill('SIGHUP')
	})

	simulator.on('error', err => {
		logger.error('Failed to start Simulator.');
		res.status(500).end()
	})

	simulator.stdout.on('data', data => {
		data
			.toString()
			.split('\n')
			.forEach(line => {
				if (line.split(' ').length > 1)
					output.simulator.register_states.push(line)
				else
					output.simulator.memory_dump.push(line)
			})
	})

	simulator.stderr.on('data', data => {
		logger.info(`SIMULATOR STDERR: ${data.toString()}`)
		output.simulator = data.toString().split("\n")
		res.status(500).end()
	})

	assembler.on('exit', code => {
		if (code != 0)
			return
		
		simulator.stdin.write(output.assembler)
		simulator.stdin.end()
		output.assembler = output.assembler.split('\n')
	})

	simulator.on('exit', (code, signal) => {
		if (code == 0)
			res.json(output)
		else if (signal != 'SIGHUP')
			res.status(500).end()
	})
})

module.exports = assemblerRouter
