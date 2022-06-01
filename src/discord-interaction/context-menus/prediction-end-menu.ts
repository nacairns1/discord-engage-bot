import { PredictionEntries } from "@prisma/client";
import { MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { cashOutPlayers } from "../../db-interactions/discord/discord-transactions";

export const predictionEndMenuFunc = (outcome_1: string, outcome_2: string) => new MessageSelectMenu()
	.setCustomId("prediction-end")
	.setPlaceholder("SELECTING AN OPTION ENDS THE PREDICTION")
	.addOptions([
		{
			label: `${outcome_1}`,
			description: "Select this to end the prediction",
			value: "outcome_1",
		},
		{
			label: `${outcome_2}`,
			description: "Select this to end the prediction",
			value: "outcome_2",
		},
	]);

	export const predictionEndMenuController = async (interaction: SelectMenuInteraction) => {
		const rawContent = interaction.message.content;
		const splitContent = rawContent.split(' ');
		const pid = splitContent[splitContent.length - 1];
		
		console.log( `ending prediction pid: ${pid}`);
		const decided_outcome = interaction.values[0];
		
		let finalScores: {
			totalSum: number;
			winnerSum: number;
			topWinner: PredictionEntries | undefined;
		} | null | undefined
		try {

			finalScores = await cashOutPlayers(pid, decided_outcome);
			if (finalScores === undefined) {
				await interaction.reply(`Error ending the prediction. Check the list of active predictions to see a list of predictions available`);
				return;
			}
			await interaction.reply(`${finalScores?.topWinner?.decided_outcome} won! Distributing ${finalScores?.totalSum} to the winners...`);
			return;
		} catch (e)  {
			await interaction.reply({content: 'Error when ending the prediction. Please try again.' , ephemeral: true});
		}


	}