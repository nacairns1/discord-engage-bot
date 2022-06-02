import { PredictionEntries } from "@prisma/client";
import { SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import {
	cashOutPlayers,
	refundDiscordPrediction,
} from "../../db-interactions/discord/discord-transactions";
import { findUserGuildMembership } from "../../db-interactions/userGuildMemberships/userGuildMemberships";


export const predictionEndMenuFunc = (outcome_1: string, outcome_2: string) =>
	new SelectMenuBuilder()
		.setCustomId("prediction-end")
		.setPlaceholder("SELECTING AN OPTION ENDS THE PREDICTION")
		.addOptions([
			{
				label: `${outcome_1}`,
				description: "Select this to end the prediction",
				value: `${outcome_1}`,
			},
			{
				label: `${outcome_2}`,
				description: "Select this to end the prediction",
				value: `${outcome_2}`,
			},
			{
				label: `REFUND`,
				description: "Select this value to refund the prediction",
				value: "REFUND",
			},
		]);

export const predictionEndMenuController = async (
	interaction: SelectMenuInteraction
) => {
	await interaction.deferReply();
	const rawContent = interaction.message.content;
	const splitContent = rawContent.split(" ");
	const pid = splitContent[splitContent.length - 1];

	const decided_outcome = interaction.values[0];

	console.log(`ending prediction pid: ${pid} outcome: ${decided_outcome}`);
	let finalScores:
		| {
				totalSum: number;
				winnerSum: number;
				topWinner: PredictionEntries | undefined;
		  }
		| null
		| undefined;
	try {

		const user = interaction.user;
		const guildId = interaction.guildId;
		if (guildId === null) {
			return null;
		}


		const userCheck = await findUserGuildMembership(user.id, guildId);
		if (userCheck === null || !userCheck.admin) {
			interaction.followUp({
				content: "You do not have admin priveleges.",
				ephemeral: true,
			});
			return;
		}


		if (decided_outcome === "REFUND") {
			await refundDiscordPrediction(pid);
			await interaction.followUp({
				content: "Refund successful.",
				ephemeral: true,
			});
			return;
		}

		finalScores = await cashOutPlayers(pid, decided_outcome);
		if (finalScores === undefined) {
			await interaction.followUp({
				content: `Error ending the prediction.`,
				ephemeral: true,
			});
			return;
		}

		if (finalScores === null) {
			await interaction.followUp({content: `Prediction has already ended.`, ephemeral: true});
			return;
		}
		await interaction.followUp(
			`${decided_outcome} won! They won a total of ${finalScores?.totalSum} points!`
		);
		return;
	} catch (e) {
		await interaction.followUp({
			content: "Error when ending the prediction. Please try again.",
			ephemeral: true,
		});
	}
};
