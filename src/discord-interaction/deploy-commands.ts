import { REST }  from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token } from '../config.json';
import * as  fs from 'node:fs';
import * as path from 'path';
import Command from './commands/CommandInterface';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/rest/v10';

const {clientId, guildId} = require('../config.json');

const commandPath = path.resolve(__dirname, './commands');
const commands = new Array<RESTPostAPIApplicationCommandsJSONBody>;
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js') && !file.includes('Interface'));

commandFiles.map(file => {

	const individualPath = path.resolve(commandPath,`./${file}`);

	console.log(`queueing command: ${individualPath}`);
	

	const command = require(individualPath).default;

	if(command.data === undefined) return;


	commands.push(command.data.toJSON());
});
	


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
