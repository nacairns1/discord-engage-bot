import { ButtonInteraction, Interaction, MessageContextMenuInteraction, MessageSelectMenu, ReactionUserManager, SelectMenuInteraction } from 'discord.js';
import Event from './EventInterface';
import { client } from '../index';
import { addUserOnButtonClicked } from '../buttons/join-button';
import { checkPointsMessageButtonController } from '../buttons/check-name-button';
import { predictionEndMenuController } from '../context-menus/prediction-end-menu';

const interactionCreate:Event = {
	name: "interactionCreate",
	async execute(interaction:Interaction) {


		if (interaction.isButton()) {
			const button:ButtonInteraction = interaction;
			const buttonId = button.customId;
			if (buttonId === 'user-join') await addUserOnButtonClicked(button);
			if (buttonId === 'user-check') await checkPointsMessageButtonController(button);
			return;
		}

		if (interaction.isModalSubmit()) {
			 
			// TO DO IMPLEMENT MODAL ROUTES

		}

		if(interaction.isSelectMenu()) {
			const msm:SelectMenuInteraction = interaction;
			if (msm.customId === 'prediction-end') await predictionEndMenuController(msm);
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