const { SlashCommandBuilder } = require("@discordjs/builders");

const data = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		await interaction.reply("Pong!");
	},
};

module.exports = data;
