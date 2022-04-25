module.exports = {
    data: new SlashCommandBuilder()
        .setName('prediction-end')
        .setDescription('Ends the active prediction')
        .addStringOption(option =>
            option.setName('payout')
                .setDescription('Believers, Doubters, Refund')
                .setRequired(true)),
    async execute(interaction) {
    }
};