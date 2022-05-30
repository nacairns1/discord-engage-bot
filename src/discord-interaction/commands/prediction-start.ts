import {
	Modal,
	TextInputComponent,
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
	MessageEmbed,
	CommandInteraction
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Command from "./CommandInterface";

// starts a new prediction

const predictionStart:Command = {
	data: new SlashCommandBuilder().setName("prediction-start").setDescription("Creates a new active Prediction"),
	async execute(interaction:CommandInteraction) {
		const predictionEmbed = new MessageEmbed()
			.setTitle("Prediction Started!")
			.setDescription("Prediction outcomes: outcome_1, outcome_2")
			.addFields(
				{ name: "Outcome_1", value: "xyz bettors", inline: true },

				{
					name: "Points wagered: $$$$",
					value: "Highest Bettor: HAHAHAHHAHA",
					inline: false,
				},
				{ name: "Outcome_2", value: "123 bettors", inline: true },
				{
					name: "Points wagered: $$$$",
					value: "Highest Bettor: HAHAHAHHAHA",
					inline: false,
				}
			)
			.setTimestamp()
			.setFooter({
				text: "Prediction Bot",
			});

		const submitRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("button1")
				.setLabel("JOIN PREDICTION")
				.setStyle("PRIMARY")
		);

		await interaction.reply({
			content: `Prediction Started in Channel ${interaction.channel}!`,
			embeds: [predictionEmbed],
			components: [ submitRow],
		});
	},
};

export default predictionStart;