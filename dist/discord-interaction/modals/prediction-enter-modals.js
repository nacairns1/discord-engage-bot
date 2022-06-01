"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalEnterSubmitHandler = exports.predictionEntryModalGenerator = void 0;
const builders_1 = require("@discordjs/builders");
const v10_1 = require("discord-api-types/v10");
const words_to_numbers_1 = __importDefault(require("words-to-numbers"));
const discord_transactions_1 = require("../../db-interactions/discord/discord-transactions");
const predictionEntryModalGenerator = (predicted_outcome) => {
    const pointsInput = new builders_1.TextInputBuilder()
        .setCustomId("predicted-points")
        .setLabel(`How many points do you want to wager?`)
        .setValue("0")
        .setPlaceholder("MUST Be a Number")
        .setRequired(true)
        .setStyle(v10_1.TextInputStyle.Short);
    const choicesInput = new builders_1.TextInputBuilder()
        .setCustomId("predicted-outcome")
        .setLabel("Predicted Outcome")
        .setValue(predicted_outcome)
        .setRequired(true)
        .setStyle(v10_1.TextInputStyle.Short);
    const firstActionRow = new builders_1.ActionRowBuilder().addComponents(pointsInput);
    const secondActionRow = new builders_1.ActionRowBuilder().setComponents(choicesInput);
    return new builders_1.ModalBuilder()
        .setCustomId(`enter-modal`)
        .setTitle(`Prediction Entry for ${predicted_outcome}`)
        .addComponents(firstActionRow, secondActionRow);
};
exports.predictionEntryModalGenerator = predictionEntryModalGenerator;
const modalEnterSubmitHandler = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const message = interaction.message;
    if (message === null)
        return;
    const rawContent = message.content;
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const predicted_outcome = interaction.fields.getTextInputValue("predicted-outcome");
    const wagered_points_input = (0, words_to_numbers_1.default)(interaction.fields.getTextInputValue("predicted-points"));
    if (wagered_points_input === null) {
        await interaction.followUp({
            content: "Error submitting! Make sure you entered a number for your points.",
            ephemeral: true,
        });
        return;
    }
    let wagered_points;
    if (typeof wagered_points_input === "number") {
        wagered_points = wagered_points_input;
    }
    else {
        wagered_points = parseInt(wagered_points_input);
    }
    if (guildId === null)
        return null;
    if (rawContent === undefined)
        return null;
    let contentArr = rawContent.split(" ");
    let predictionId = contentArr[contentArr.length - 1];
    console.log(predictionId);
    try {
        const newPredictionEntry = await (0, discord_transactions_1.addNewDiscordPredictionEntry)(predictionId, userId, guildId, wagered_points, predicted_outcome);
        if (newPredictionEntry === null) {
            await interaction.followUp({
                content: "Error submitting! Make sure the prediction is still open.",
                ephemeral: true,
            });
            return;
        }
        if (newPredictionEntry === undefined) {
            await interaction.followUp({
                content: "You have no points! Stay engaged in the server to earn more.",
                ephemeral: true,
            });
            return;
        }
        if (wagered_points <= 0) {
            await interaction.followUp({
                content: "You have to bet a valid number of points!",
                ephemeral: true,
            });
        }
        await interaction.followUp({
            content: `Successfully submitted ${newPredictionEntry.wageredPoints} points for **${newPredictionEntry.predicted_outcome}**`,
            ephemeral: true,
        });
    }
    catch (e) {
        await interaction.followUp({
            content: "Error adding your prediction! Check and see if its still open and try again.",
            ephemeral: true,
        });
        return;
    }
};
exports.modalEnterSubmitHandler = modalEnterSubmitHandler;
