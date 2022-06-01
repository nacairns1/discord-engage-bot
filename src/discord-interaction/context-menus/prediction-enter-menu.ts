import { PredictionEntries } from "@prisma/client";
import { MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { cashOutPlayers } from "../../db-interactions/discord/discord-transactions";
import { predictionEntryModalGenerator } from "../modals/prediction-enter-modals";

export const predictionEnterMenuFunc = (pid: string, outcome_1: string, outcome_2: string) => new MessageSelectMenu()
	.setCustomId("prediction-enter")
	.setPlaceholder("SELECTING AN OPTION OPENS A PREDICTION INPUT")
	.addOptions([
		{
			label: `${outcome_1}`,
			description: "Select this to enter the prediction",
			value: `${outcome_1}`,
		},
		{
			label: `${outcome_2}`,
			description: "Select this to enter the prediction",
			value: `${outcome_2}`,
		},
	]);

	export const predictionEnterMenuController = async (interaction: SelectMenuInteraction) => {

		const rawContent = interaction.message.content;
		const splitContent = rawContent.split(' ');
		const pid = splitContent[splitContent.length - 1];
		
        console.log(interaction.component);
        console.log(interaction.values);
        const predicted_outcome = interaction.values[0];

		console.log( `opening prediction popup ${pid} for user ${interaction.user.id} in guild ${interaction.guildId}`);
		
        const modal = predictionEntryModalGenerator(predicted_outcome);
        interaction.showModal(modal);

		try {
            
		
		} catch (e)  {
			await interaction.reply({content: 'Error when entering the prediction. Please try again. Make sure you input a number and a valid predicted outcome!' , ephemeral: true});
		}


	}