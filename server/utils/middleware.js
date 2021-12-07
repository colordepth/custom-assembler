const logger = require('./logger')

const requestLogger = (req, res, next) => {
	logger.info('Time:	', new Date().toString())
	logger.info('Method:', req.method)
	logger.info('Path:	', req.path)
	logger.info('Body:	', req.body)
	logger.info('IP:	', req.ip)
	logger.info('---')
	next()
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
	requestLogger,
	unknownEndpoint
}
