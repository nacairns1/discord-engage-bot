import { PredictionEntries } from "@prisma/client";
import { SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import {
	cashOutPlayers,
	refundDiscordPrediction,
} from "../../db-interactions/discord/discord-transactions";
import { findPredictionById } from "../../db-interactions/predictions/db-predictions";
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
		const prediction = await findPredictionById(pid);

		if (prediction === null) {
			console.error("null prediction found");
			throw Error("null prediction found.");
		}

		const { creatorId } = prediction;

		if (userCheck === null) {
			interaction.followUp("You are not a registered user!");
			return;
		} else if (
			!userCheck.admin &&
			creatorId === user.id &&
			!userCheck.manager
		) {
			interaction.followUp(
				"You do not have manager privileges on this server."
			);
			return;
		} else if (
			!userCheck.admin &&
			!(creatorId === user.id && userCheck.manager)
		) {
			interaction.followUp({
				content: "You do not have admin privileges on this server.",
				ephemeral: true,
			});
			return;
		}

		if (userCheck.admin || (creatorId === user.id && userCheck.manager)) {
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
				await interaction.followUp({
					content: `Prediction has already ended.`,
					ephemeral: true,
				});
				return;
			}
			await interaction.followUp(
				`${decided_outcome} won! They won a total of ${finalScores?.totalSum} points!`
			);
			return;
		}
		throw Error ('uncaught situation.')
	} catch (e) {
		await interaction.followUp({
			content: "Error when ending the prediction. Please try again.",
			ephemeral: true,
		});
	}
};
