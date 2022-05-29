const {
	Modal,
	TextInputComponent,
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
	MessageEmbed,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const ping = {
	data: new SlashCommandBuilder()
		.setName("prediction-create")
		.setDescription("Creates a new Prediction"),
	async execute(interaction) {
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

module.exports = ping;
