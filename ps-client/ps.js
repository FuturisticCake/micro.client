const net = require('net')

module.exports = (host, port, cb) => {
	var connection = net.createConnection(port, host, () => {
		// Connection established
		connection.end()
		cb(true)
	})

	connection.setTimeout(3000, () => {
		console.log('Connection to port ' + port + ' took too long.')
		cb(false)
	})

	connection.on('error', (connectionError) => {
		cb(false)
	})
}