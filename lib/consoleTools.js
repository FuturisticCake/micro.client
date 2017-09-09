const readline = require('readline')
const EventEmitter = require('events').EventEmitter

// Set up a readline interface

const rl = readline.createInterface({
	'input': process.stdin,
	'output': process.stdout
})

const consoleTools = new EventEmitter()

rl.on('line', (input) => {
	const args = command.split(' ')
	const command = args.splice(0, 1)
	consoleTools.emit('command', command, args)
})

module.exports = { rl, consoleTools }