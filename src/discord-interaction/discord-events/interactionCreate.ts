import { ButtonInteraction, Interaction, MessageContextMenuInteraction, MessageSelectMenu, ModalSubmitInteraction, ReactionUserManager, SelectMenuInteraction } from 'discord.js';
import Event from './EventInterface';
import { client } from '../index';
import { addUserOnButtonClicked } from '../buttons/join-button';
import { checkPointsMessageButtonController } from '../buttons/check-name-button';
import { predictionEndMenuController } from '../context-menus/prediction-end-menu';
import { enterUserOnButtonClicked } from '../buttons/enter-prediction-buton';
import { predictionEnterMenuController } from '../context-menus/prediction-enter-menu';
import { modalEnterSubmitHandler } from '../modals/prediction-enter-modals';

const interactionCreate:Event = {
	name: "interactionCreate",
	async execute(interaction:Interaction) {

		console.log(interaction);
		if (interaction.isButton()) {
			const button:ButtonInteraction = interaction;
			const buttonId = button.customId;
			if (buttonId === 'user-join') await addUserOnButtonClicked(button);
			if (buttonId === 'user-check') await checkPointsMessageButtonController(button);
			if (buttonId.includes('user-enter')) await enterUserOnButtonClicked(button);
			return;
		}

		if(interaction.isSelectMenu()) {
			const msm:SelectMenuInteraction = interaction;
			if (msm.customId === 'prediction-end') await predictionEndMenuController(msm);
			if (msm.customId === 'prediction-enter') await predictionEnterMenuController(msm);
		}

		if(interaction.isModalSubmit()) {
			const ms:ModalSubmitInteraction = interaction;
			if (ms.customId === 'enter-modal') await modalEnterSubmitHandler(ms);
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