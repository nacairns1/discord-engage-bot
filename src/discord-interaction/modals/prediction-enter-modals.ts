import {
	ActionRowBuilder,
	ModalBuilder,
	SelectMenuBuilder,
	TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "discord-api-types/v10";
import {
	ButtonInteraction,
	Message,
	ModalActionRowComponent,
	ModalActionRowComponentBuilder,
	ModalSubmitInteraction,
	TextInputComponent,
} from "discord.js";

import wordsToNumbers from "words-to-numbers";

import { addNewDiscordPredictionEntry } from "../../db-interactions/discord/discord-transactions";

export const predictionEntryModalGenerator = (predicted_outcome: string) => {
	const pointsInput: ModalActionRowComponentBuilder = new TextInputBuilder()
		.setCustomId("predicted-points")
		.setLabel(`How many points do you want to wager?`)
		.setValue("0")
		.setPlaceholder("MUST Be a Number")
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const choicesInput: ModalActionRowComponentBuilder = new TextInputBuilder()
		.setCustomId("predicted-outcome")
		.setLabel("Predicted Outcome")
		.setValue(predicted_outcome)
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(pointsInput);
	const secondActionRow = new ActionRowBuilder<TextInputBuilder>().setComponents(choicesInput);

	return new ModalBuilder()
		.setCustomId(`enter-modal`)
		.setTitle(`Prediction Entry for ${predicted_outcome}`)
		.addComponents(firstActionRow, secondActionRow);
};

export const modalEnterSubmitHandler = async (
	interaction: ModalSubmitInteraction
) => {
	await interaction.deferReply({ ephemeral: true });

	const message = interaction.message;
	if (message === null) return;
	const rawContent = message.content;
	const userId = interaction.user.id;
	const guildId = interaction.guildId;
	const predicted_outcome =
		interaction.fields.getTextInputValue("predicted-outcome");
	const wagered_points_input = wordsToNumbers(
		interaction.fields.getTextInputValue("predicted-points")
	);
	if (wagered_points_input === null) {
		await interaction.followUp({
			content:
				"Error submitting! Make sure you entered a number for your points.",
			ephemeral: true,
		});
		return;
	}
	let wagered_points: number;

	if (typeof wagered_points_input === "number") {
		wagered_points = wagered_points_input;
	} else {
		wagered_points = parseInt(wagered_points_input);
	}
	if (guildId === null) return null;
	if (rawContent === undefined) return null;

	let contentArr = rawContent.split(" ");
	let predictionId = contentArr[contentArr.length - 1];
	console.log(predictionId);

	try {
		const newPredictionEntry = await addNewDiscordPredictionEntry(
			predictionId,
			userId,
			guildId,
			wagered_points,
			predicted_outcome
		);

		if (newPredictionEntry === null) {
			await interaction.followUp({
				content: "Error submitting! Make sure the prediction is still open.",
				ephemeral: true,
			});
			return;
		}
		if (newPredictionEntry === undefined) {
			await interaction.followUp({
				content: "You have no points! Stay engaged in the server to earn more.",
				ephemeral: true,
			});
			return;
		}
		if (wagered_points <= 0) {
			await interaction.followUp({
				content: "You have to bet a valid number of points!",
				ephemeral: true,
			});
		}

		await interaction.followUp({
			content: `Successfully submitted ${newPredictionEntry.wageredPoints} points for **${newPredictionEntry.predicted_outcome}**`,
			ephemeral: true,
		});
	} catch (e) {
		await interaction.followUp({
			content:
				"Error adding your prediction! Check and see if its still open and try again.",
			ephemeral: true,
		});
		return;
	}
};
