"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterUserOnButtonClicked = exports.closedMessageButton = exports.enterMessageButton = exports.enterButton = void 0;
const v10_1 = require("discord-api-types/v10");
const discord_js_1 = require("discord.js");
const db_predictions_1 = require("../../db-interactions/predictions/db-predictions");
const prediction_enter_menu_1 = require("../context-menus/prediction-enter-menu");
exports.enterButton = new discord_js_1.ButtonBuilder()
    .setCustomId("user-enter")
    .setLabel("START POINTS!")
    .setStyle(v10_1.ButtonStyle.Primary);
const enterMessageButton = (pid) => new discord_js_1.ButtonBuilder()
    .setCustomId(`user-enter ${pid}`)
    .setLabel("ENTER!")
    .setStyle(v10_1.ButtonStyle.Primary);
exports.enterMessageButton = enterMessageButton;
exports.closedMessageButton = new discord_js_1.ButtonBuilder()
    .setCustomId("user-closed")
    .setLabel("CLOSED!")
    .setStyle(v10_1.ButtonStyle.Success)
    .setDisabled(true);
const enterUserOnButtonClicked = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const guildId = interaction.guildId;
    const pid = interaction.customId.split(' ')[1];
    if (guildId === null) {
        console.log("cannot enter a prediction from outside of a guild");
        return;
    }
    const prediction = await (0, db_predictions_1.findPredictionById)(pid);
    if (prediction === null)
        return;
    const selectMenuToShow = (0, prediction_enter_menu_1.predictionEnterMenuFunc)(pid, prediction.outcome_1, prediction.outcome_2);
    const row = new discord_js_1.ActionRowBuilder().addComponents([selectMenuToShow]);
    await interaction.followUp({ components: [row], content: `Enter Prediction! pid: ${prediction.predictionId}`, ephemeral: true });
};
exports.enterUserOnButtonClicked = enterUserOnButtonClicked;
