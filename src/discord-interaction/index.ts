import  * as fs from 'fs';
import { Client, Collection, Intents, ClientOptions } from "discord.js";
import { token } from '../config.json';
import * as path from 'path';
import Command from './commands/CommandInterface';

class tsClient extends Client {
	constructor(options: ClientOptions) {
		super(options);
	}
	commands?: Collection<string, Command>;
	buttons?: Collection<string, Command>;
}

export const client = new tsClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

client.commands = new Collection();

const commandPath = path.resolve(__dirname, "./commands");
const eventPath = path.resolve(__dirname, "./discord-events");

const commandFiles = fs
	.readdirSync(commandPath)
	.filter((file) => file.endsWith(".js") && !file.includes('Interface'));

for (const file of commandFiles) {
	console.log(file);
	const command = require(`./commands/${file}`).default;
	console.log(command);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs
	.readdirSync(eventPath)
	.filter((file) => file.endsWith(".js") && !file.includes('Interface'));

	
for (const file of eventFiles) {

	const filePath = path.resolve(`${eventPath}`, `${file}`);
	const event = require(`${filePath}`).default;
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
