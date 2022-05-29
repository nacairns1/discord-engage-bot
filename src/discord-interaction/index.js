const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("../config.json");
const path = require("path");

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

client.commands = new Collection();

const commandPath = path.resolve("./discord-interaction/commands");
const eventPath = path.resolve("./discord-interaction/discord-events");

const commandFiles = fs
	.readdirSync(commandPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs
	.readdirSync(eventPath)
	.filter((file) => file.endsWith(".js"));

	
for (const file of eventFiles) {

	const filePath = path.resolve(`${eventPath}`, `${file}`);
	const event = require(`${filePath}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


try {
	client.login(token);
	console.log(`logged into discord`);
} catch (e) {
	console.error(e);
}
