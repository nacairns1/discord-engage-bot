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
	intervals?: Collection<string, NodeJS.Timer>
	
}

export const client = new tsClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.DIRECT_MESSAGES
	],
	
});

client.commands = new Collection();
client.intervals = new Collection();

const commandPath = path.resolve(__dirname, "./commands");
const eventPath = path.resolve(__dirname, "./discord-events");

const commandFiles = fs
	.readdirSync(commandPath)
	.filter((file) => file.endsWith(".js") && !file.includes('Interface'));

for (const file of commandFiles) {
	
	const command = require(`./commands/${file}`).default;
	client.commands.set(command.data.name, command);
}

const eventFiles = fs
	.readdirSync(eventPath)
	.filter((file) => file.endsWith(".js") && !file.includes('Interface'));

	
for (const file of eventFiles) {

	const filePath = path.resolve(`${eventPath}`, `${file}`);
	
	const event = require(filePath).default;
	console.log(`adding listener for events: ${event.name}`);

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
