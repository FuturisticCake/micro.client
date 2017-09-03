const ps = require("./ps.js");
const mc = require("mineflayer");

const host = "s1.hosthorde.com";

var scanPort = 25970;

console.log("Starting MC port scanner...");

var scanNext = () => {
	scanPort++;
	ps(host, scanPort, (portOpen) => {
		if (!portOpen) {
			console.log("x " + scanPort + " - Port not open.");
			scanNext();
		}
		else {
			try {
				var mcClient = mc.createBot({
					"username": "offlineBotAccount",
					"host": host,
					"port": scanPort
				});

				mcClient.on("spawn", () => {
					console.log("Y - " + scanPort + " - Client spawned into game. Version: " + mcClient.version + ", Player count: " + mcClient.players.length);
					mcClient.end();
					scanNext();
				});

				mcClient.on("kicked", (kickMessage) => {
					console.log("x - " + scanPort + " - Client kicked: " + kickMessage + ". Version: " + mcClient.version);
					scanNext();
				});
			}
			catch (err) {
				console.log("Error connecting bot to port " + scanPort);
			}
		}
	});
};

scanNext();
