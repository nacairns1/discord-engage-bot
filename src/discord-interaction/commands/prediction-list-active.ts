import { SlashCommandBuilder } from "@discordjs/builders";
import { Predictions } from "@prisma/client";
import {
	CommandInteraction,
	MessageEmbed,
	MessageEmbedOptions,
} from "discord.js";
import { getAllActivePredictionsInGuildId } from "../../db-interactions/discord/discord-predictions";
import Command from "./CommandInterface";

// generates the first three active predictions found. Will say how many there are
const listEmbedBuilder = (lp: Predictions[]) => {

	const author = {
		name: "PredictionBot",
		url: "https://github.com/nacairns1/discord-engage-bot",
	};
	const fields = [];
	for (let i = 0; i < lp.length; i++) {
		if (i >= 3) break;
		let predictionId = lp[i].predictionId;
		let isOpen = lp[i].isOpen;
		let outcome_1 = lp[i].outcome_1;
		let outcome_2 = lp[i].outcome_2;

		fields.push({
			name: predictionId,
			value: `${outcome_1} OR ${outcome_2} \n Still Open? ${isOpen}`,
		});
	}

	return new MessageEmbed()
		.setAuthor(author)
		.setDescription("Active Predictions")
		.setFields([...fields])
		.setTimestamp();
};

// lists the active predictions in a given guild

const predictionUserInit: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-list-active")
		.setDescription("Lists all active predictions on the guild"),
	async execute(interaction: CommandInteraction) {
		const guildId = interaction.guildId;
		if (guildId === null)
			throw Error("cannot check predictions outside of guild");

		await interaction.deferReply();

		const predictions = await getAllActivePredictionsInGuildId(guildId);
		if (predictions === null) {
			await interaction.followUp({
				content: "No active predictions found!",
				ephemeral: true,
			});
			return null;
		} else {
			const predictionsString = "Predictions still active!";
			const embed = listEmbedBuilder(predictions);

			await interaction.followUp({content: predictionsString, embeds: [embed] });
		}
	},
};

export default predictionUserInit;
