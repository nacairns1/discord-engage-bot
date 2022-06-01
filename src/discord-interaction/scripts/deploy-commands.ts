import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token } from '../../config.json';
import * as  fs from 'node:fs';
import * as path from 'path';
import Command from '../commands/CommandInterface';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/rest/v10';
import { rejects } from 'node:assert';
import { findAllGuilds } from '../../db-interactions/guilds/db-guilds';
import { APIApplicationCommandSubcommandOption } from 'discord-api-types/v10';

import { clientId } from '../../config.json';


export const addCommandsToGuild = async (guildId: string) => {

	const commandPath = path.resolve(__dirname, '../commands');
	const commands: Array<RESTPostAPIApplicationCommandsJSONBody | APIApplicationCommandSubcommandOption> = [];
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js') && !file.includes('Interface') );

	commandFiles.map(file => {

		const individualPath = path.resolve(commandPath, `./${file}`);

		console.log(`queueing command: ${individualPath}`);

		const commandModule:Command = require(individualPath).default;

		const command = commandModule;

		if (command.data === undefined ) return;

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
			return rejects;
		}
	})();
}

const findGuildsToUpdate = async () => {
	const guilds = await findAllGuilds();
	return guilds;
}


export const updateGuilds = async () => {
	const guilds = await findGuildsToUpdate();
	if (guilds === undefined) return;
	const promiseArr:Promise<void>[] = [];
	guilds.map((g)=>{
		console.log(g.guildId);
		 promiseArr.push(addCommandsToGuild(g.guildId))
		});
	await Promise.all(promiseArr);
}