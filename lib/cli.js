const readline = require('readline')
try {
	const mineflayer = require('mineflayer')
} catch (err) {
	console.error('mineflayer is required to run micro.client. Run "npm install" to install it.')
	process.exit(-1)
}
const kaPlugin = require('./index.js')

// Set up a readline interface

const rl = readline.createInterface({
	'input': process.stdin,
	'output': process.stdout
})

function queryPassword(query, cb) {
	process.stdout.write(query)
	process.stdin.on('data', dataHandler)
	var pwd = ''
	function dataHandler(char) {
		switch (char.toString()) {
			case '\n':
			case '\r':
			case '\u0004':
				process.stdin.removeListener('data', dataHandler)
				cb(pwd)
				return
			default:
			pwd += char
				process.stdout.write('\033[2K\033[200D' + query)
		}
	}
}
/*
help - Display this menu
list - list all players on the server
chat <message> - chats the specified message
ka - enable killaura
	-p - Target players
	-m - Target mobs
	-t - Enable teleportation
	-f - Enable player following
dka - Disable killaura
cs <control state> [on/off] (defaults to on) - Alters the control states of the bot
	Control States:
		forward - Makes the bot move forward
		back - Makes the bot move backward
		left - Makes the bot move to the left
		right - Makes the bot move to the right
		jump - Makes the bot jump
		sprint - Makes the bot sprint
*/

function listPlayers(bot) {
	console.log(Object.values(bot.players).map((el) => el.username).join(', '))
}

function start(bot) {
	bot.once('spawn', () => {
		bot.on('chat', (username, message) => {
			console.log(`[${username}] ${message}`)
		}).on('whisper', (username, message) => {
			console.log(`${username} whispers to you: ${message}`)
		})
		bot.on('message', (obj) => {
			if (obj.json.translate) {
				switch (obj.json.translate) {
					case 'chat.type.text':
					case 'commands.tp.success':
					case 'commands.message.display.incoming':
						break
					case 'commands.generic.notFound':
						console.log('Command not found.')
						break
					case 'commands.players.list':
						listPlayers(bot)
						break
					case 'multiplayer.player.joined':
						console.log(obj.with[0].text + ' joined the game.')
						break
					case 'multiplayer.player.left':
						console.log(obj.with[0].text + ' left the game.')
						break
					case 'death.attack.player':
						console.log(obj.with[0].text + ' was slain by ' + obj.with[1].text + '.')
						break
					default:
						console.log(obj.json.translate)
				}
			}
		})
		console.log('Bot started! Ready for commands.')
		rl.on('line', (input) => {
			const args = input.split(' ')
			const command = args.splice(0, 1)[0]
			switch (command) {
				case 'list':
					listPlayers(bot)
					break
				case 'chat':
					bot.chat(args.join(' '))
					break
				case 'ka':
					const entityTypes = [ ]
					var follow = false, teleport = false
					if (args.indexOf('-p') !== -1) {
						entityTypes.push('player')
					}
					if (args.indexOf('-m') !== -1) {
						entityTypes.push('mob')
					}
					if (args.indexOf('-t') !== -1) {
						teleport = true
					} else if (args.indexOf('-f') !== -1) {
						follow = true
					}
					bot.enableKillAura(entityTypes, follow, teleport)
					break
				case 'dka':
					bot.disableKillAura()
					break
				case 'cs':
					try {
						bot.setControlState(args[0], args[1] === 'off' ? false : true)
					} catch (e) {
						console.log('Unknown control state. Use "help" for help.')
					}
					break
				case 'help':
				default:
					console.log('help - Display this menu\nlist - list all players on the server\nchat <message> - chats the specified message\nka - enable killaura\n\t-p - Target players\n\t-m - Target mobs\n\t-t - Enable teleportation\n\t-f - Enable player following\ndka - Disable killaura\ncs <control state> [on/off] (defaults to on) - Alters the control states of the bot\n\tControl States:\n\t\tforward - Makes the bot move forward\n\t\tback - Makes the bot move backward\n\t\tleft - Makes the bot move to the left\n\t\tright - Makes the bot move to the right\n\t\tjump - Makes the bot jump\n\t\tsprint - Makes the bot sprint')
			}
		})
	})
}

if (process.argv.length === 5) {
	const host = process.argv[2], port = process.argv[3], username = process.argv[4]
	
	queryPassword('Enter the password of the player to join: ', (password) => {
		const bot = mineflayer.createBot({ host, port, username, password })
		bot.loadPlugin(kaPlugin)
		start(bot)
	})
} else {
	console.error('Usage: node lib/cli <hostname> <port> <username>')
	process.exit(-1)
}