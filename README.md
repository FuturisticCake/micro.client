# micro.client
A Minecraft client, completely console (and Node.js) powered.

To start the client, use the following command:

```
node lib/cli.js <hostname> <port> <username/email>
```

Commands:

- help - Display the help menu
- list - list all players on the server
- chat \<message> - chats the specified message
- ka - enable killaura
	- -p - Target players
	- -m - Target mobs
	- -t - Enable teleportation
	- -f - Enable player following
- dka - Disable killaura
- cs \<control state> [on/off] (defaults to on) - Alters the control states of the bot
	- Control States:
		- forward - Makes the bot move forward
		- back - Makes the bot move backward
		- left - Makes the bot move to the left
		- right - Makes the bot move to the right
		- jump - Makes the bot jump
		- sprint - Makes the bot sprint

Requiring the module in code returns a mineflayer killaura plugin.