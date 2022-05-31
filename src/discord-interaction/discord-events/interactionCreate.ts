import { Interaction } from 'discord.js';
import Event from './EventInterface';
import { client } from '../index';

const interactionCreate:Event = {
	name: "interactionCreate",
	async execute(interaction:Interaction) {
		if (interaction.isButton()) {

			// TO DO IMPLEMENT BUTTON ROUTES 
		}

		if (interaction.isModalSubmit()) {
			 
			// TO DO IMPLEMENT MODAL ROUTES

		}

		if (interaction.isCommand()) {
			if (client.commands === undefined) return; 
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	},
};

export default interactionCreate;