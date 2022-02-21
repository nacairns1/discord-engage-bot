module.exports = {
    name: 'beginTracking',
    async execute(interaction) {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered a button interaction.`);
    }
};