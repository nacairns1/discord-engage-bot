"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictionEndMenuController = exports.predictionEndMenuFunc = void 0;
const discord_js_1 = require("discord.js");
const discord_transactions_1 = require("../../db-interactions/discord/discord-transactions");
const predictionEndMenuFunc = (outcome_1, outcome_2) => new discord_js_1.MessageSelectMenu()
    .setCustomId("prediction-end")
    .setPlaceholder("SELECTING AN OPTION ENDS THE PREDICTION")
    .addOptions([
    {
        label: `${outcome_1}`,
        description: "Select this to end the prediction",
        value: "outcome_1",
    },
    {
        label: `${outcome_2}`,
        description: "Select this to end the prediction",
        value: "outcome_2",
    },
]);
exports.predictionEndMenuFunc = predictionEndMenuFunc;
const predictionEndMenuController = async (interaction) => {
    const rawContent = interaction.message.content;
    const splitContent = rawContent.split(' ');
    const pid = splitContent[splitContent.length - 1];
    console.log('ending prediction pid....');
    const decided_outcome = interaction.values[0];
    try {
        const finalScores = await (0, discord_transactions_1.cashOutPlayers)(pid, decided_outcome);
        await interaction.reply(`${decided_outcome} won! Distributing ${finalScores === null || finalScores === void 0 ? void 0 : finalScores.totalSum} to the winners...`);
        return;
    }
    catch (e) {
        await interaction.reply({ content: 'Error when ending the prediction. Please try again.', ephemeral: true });
    }
};
exports.predictionEndMenuController = predictionEndMenuController;
