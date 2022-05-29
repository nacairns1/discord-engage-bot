import { REST }  from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token } from '../config.json';
import * as  fs from 'node:fs';
import * as path from 'path';

const {clientId, guildId} = require('../config.json');

const commandPath = path.resolve(__dirname, '/commands');
const commands = new Array<string>;
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    console.log(command.data);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
