"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictionEndMenuController = exports.predictionEndMenuFunc = void 0;
const discord_js_1 = require("discord.js");
const discord_transactions_1 = require("../../db-interactions/discord/discord-transactions");
const db_predictions_1 = require("../../db-interactions/predictions/db-predictions");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
const predictionEndMenuFunc = (outcome_1, outcome_2) => new discord_js_1.SelectMenuBuilder()
    .setCustomId("prediction-end")
    .setPlaceholder("SELECTING AN OPTION ENDS THE PREDICTION")
    .addOptions([
    {
        label: `${outcome_1}`,
        description: "Select this to end the prediction",
        value: `${outcome_1}`,
    },
    {
        label: `${outcome_2}`,
        description: "Select this to end the prediction",
        value: `${outcome_2}`,
    },
    {
        label: `REFUND`,
        description: "Select this value to refund the prediction",
        value: "REFUND",
    },
]);
exports.predictionEndMenuFunc = predictionEndMenuFunc;
const predictionEndMenuController = async (interaction) => {
    await interaction.deferReply();
    const rawContent = interaction.message.content;
    const splitContent = rawContent.split(" ");
    const pid = splitContent[splitContent.length - 1];
    const decided_outcome = interaction.values[0];
    console.log(`ending prediction pid: ${pid} outcome: ${decided_outcome}`);
    let finalScores;
    try {
        const user = interaction.user;
        const guildId = interaction.guildId;
        if (guildId === null) {
            return null;
        }
        const userCheck = await (0, userGuildMemberships_1.findUserGuildMembership)(user.id, guildId);
        const prediction = await (0, db_predictions_1.findPredictionById)(pid);
        if (prediction === null) {
            console.error("null prediction found");
            throw Error("null prediction found.");
        }
        const { creatorId } = prediction;
        if (userCheck === null) {
            interaction.followUp("You are not a registered user!");
            return;
        }
        else if (!userCheck.admin &&
            creatorId === user.id &&
            !userCheck.manager) {
            interaction.followUp("You do not have manager privileges on this server.");
            return;
        }
        else if (!userCheck.admin &&
            !(creatorId === user.id && userCheck.manager)) {
            interaction.followUp({
                content: "You do not have admin privileges on this server.",
                ephemeral: true,
            });
            return;
        }
        if (userCheck.admin || (creatorId === user.id && userCheck.manager)) {
            if (decided_outcome === "REFUND") {
                await (0, discord_transactions_1.refundDiscordPrediction)(pid);
                await interaction.followUp({
                    content: "Refund successful.",
                    ephemeral: true,
                });
                return;
            }
            finalScores = await (0, discord_transactions_1.cashOutPlayers)(pid, decided_outcome);
            if (finalScores === undefined) {
                await interaction.followUp({
                    content: `Error ending the prediction.`,
                    ephemeral: true,
                });
                return;
            }
            if (finalScores === null) {
                await interaction.followUp({
                    content: `Prediction has already ended.`,
                    ephemeral: true,
                });
                return;
            }
            await interaction.followUp(`${decided_outcome} won! They won a total of ${finalScores === null || finalScores === void 0 ? void 0 : finalScores.totalSum} points!`);
            return;
        }
        throw Error('uncaught situation.');
    }
    catch (e) {
        await interaction.followUp({
            content: "Error when ending the prediction. Please try again.",
            ephemeral: true,
        });
    }
};
exports.predictionEndMenuController = predictionEndMenuController;
