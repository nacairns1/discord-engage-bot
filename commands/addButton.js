const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('button')
        .setDescription('Add a button'),

	async execute(interaction) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('primary')
                .setLabel('Primary')
                .setStyle('PRIMARY'),
        );
        await interaction.reply({ content: 'Pong', components: [row]});
    },
};