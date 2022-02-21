const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
		.setName('engagement-tracking')
        .setDescription('Add a button to add users to track'),

	async execute(interaction) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('beginTracking')
                .setLabel('Click Me To Track your Activity Points')
                .setStyle('PRIMARY'),
        );


        await interaction.reply({ content: 'Track me for activity points', components: [row] });

    },
};