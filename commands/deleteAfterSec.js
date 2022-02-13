/* eslint-disable semi */
/* eslint-disable comma-dangle */
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removereply')
        .setDescription('Replies to you then deletes it 10 second later'),
    async execute(interaction) {
        const wait = require('util').promisify(setTimeout);
        await interaction.reply('initial message...');

        await wait(10000);
        await interaction.deleteReply();
    },
}
