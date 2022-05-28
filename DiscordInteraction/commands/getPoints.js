const { SlashCommandBuilder } = require('@discordjs/builders');
const { pointsManager, pointsEmitter } = require('../Managers/PointsManager');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Get your current points'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const member = interaction.member.id;
            const guild = interaction.guildId;
            const points = await pointsManager.getUserPoints(guild, member);
            await interaction.editReply({
                content: `${interaction.member.toString()} current points: ${points}`,
                ephemeral: true
            });
            console.log(pointsManager.getPredictionMap(guild).get(member));
        } catch (e) {
            console.error(e);
            await interaction.editReply('You haven\'t activated your points. React in prediction-channel to join');
        }
    },
};