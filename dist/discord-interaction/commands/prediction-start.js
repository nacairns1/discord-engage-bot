"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const check_name_button_1 = require("../buttons/check-name-button");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
const discord_predictions_1 = require("../../db-interactions/discord/discord-predictions");
const db_predictions_1 = require("../../db-interactions/predictions/db-predictions");
const db_prediction_entries_1 = require("../../db-interactions/prediction-entries/db-prediction-entries");
const enter_prediction_buton_1 = require("../buttons/enter-prediction-buton");
const prediction_end_button_1 = require("../buttons/prediction-end-button");
// starts a new prediction
const predictionStart = {
    data: new builders_1.SlashCommandBuilder()
        .setName("prediction-start")
        .setDescription("Creates a new active Prediction")
        .addStringOption((option) => option
        .setName("title")
        .setDescription("The title of the prediction")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("outcome_1")
        .setDescription("The first of two possible outcomes")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("outcome_2")
        .setDescription("The other possible outcome")
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("time_open")
        .setDescription("length of time users can enter")
        .addChoices({ value: 30, name: "short" }, { value: 60, name: "medium" }, { value: 90, name: "long" })
        .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const predictionId = interaction.id;
        const user = interaction.user;
        const outcome_1 = interaction.options.get("outcome_1", true).value;
        const outcome_2 = interaction.options.get("outcome_2", true).value;
        let title = interaction.options.get("title", true).value;
        let time_open = interaction.options.get("time_open", true).value;
        if (!(typeof outcome_1 === "string" && typeof outcome_2 === "string")) {
            return null;
        }
        if (!(typeof time_open === "number")) {
            return null;
        }
        if (!(typeof title === 'string')) {
            return null;
        }
        if (interaction.guildId === null ||
            outcome_1 === null ||
            outcome_2 === null ||
            time_open === null ||
            title === null)
            return;
        if (outcome_1.trim() === outcome_2.trim()) {
            await interaction.followUp({
                content: "The two options cannot be the same!",
                ephemeral: true,
            });
            return;
        }
        if (outcome_1.length > 15 || outcome_2.length > 15) {
            await interaction.followUp({
                content: "Your prediction options are too long. Please try again.",
                ephemeral: true,
            });
            return;
        }
        try {
            const userCheck = await (0, userGuildMemberships_1.findUserGuildMembership)(user.id, interaction.guildId);
            if (userCheck === null || !userCheck.admin) {
                await interaction.followUp({
                    content: "You do not have permission to start a prediction in this server.",
                    ephemeral: true,
                });
                return;
            }
        }
        catch (e) {
            console.error(e);
            return;
        }
        let prediction;
        try {
            prediction = await (0, discord_predictions_1.addNewPredictionInGuildByCreator)(predictionId, interaction.guildId, user.id, outcome_1, outcome_2);
        }
        catch (e) {
            return null;
        }
        function timeout(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        while (time_open > 0) {
            const message = await embedPredictionBuilder(title, predictionId, interaction.guildId, time_open);
            if (message.components === undefined || message.embeds === undefined)
                return;
            await interaction.editReply({
                content: message.content,
                embeds: message.embeds,
                components: [message.components],
            });
            await timeout(1000);
            time_open--;
        }
        const finalMessage = await embedPredictionBuilder(title, predictionId, interaction.guildId, time_open);
        await interaction.editReply({
            content: `Prediction Closed! pid: ${predictionId}`,
            embeds: finalMessage.embeds,
            components: [
                new builders_1.ActionRowBuilder().addComponents(enter_prediction_buton_1.closedMessageButton, check_name_button_1.checkPointsMessageButton, prediction_end_button_1.endPredictionButton),
            ],
        });
        const update = await (0, db_predictions_1.updatePredictionToClosed)(predictionId);
        if (update === null) {
            await interaction.followUp({
                content: "Error closing the prediction to new entries. Please check to see the prediction is still considered active (this means closable)",
                ephemeral: true,
            });
            return;
        }
        console.log(`prediction ${predictionId} closed successfully!`);
    },
};
const embedPredictionBuilder = async (title, predictionId, guildId, time) => {
    let o_1_points = 0;
    let o_2_points = 0;
    let o_2_players = 0;
    let o_1_players = 0;
    const p = await (0, db_predictions_1.findPredictionById)(predictionId);
    const gm = await (0, db_prediction_entries_1.findGuildUsersInPrediction)(guildId, predictionId);
    if (p === null)
        return { content: "No prediction found..." };
    let o_1_playerMax = 0;
    let o_1_playerMaxName = "No entries yet!";
    let o_2_playerMax = 0;
    let o_2_playerMaxName;
    if (gm === null) {
        o_1_points = 0;
        o_2_points = 0;
        o_1_players = 0;
        o_2_players = 0;
    }
    else {
        gm.map((pe) => {
            if (pe.predicted_outcome === p.outcome_1) {
                o_1_players++;
                o_1_points += pe.wageredPoints;
                if (pe.wageredPoints > o_1_playerMax) {
                    o_1_playerMax = pe.wageredPoints;
                    o_1_playerMaxName = `<@${pe.userId}>`;
                }
            }
            else if (pe.predicted_outcome === p.outcome_2) {
                o_2_players++;
                o_2_points += pe.wageredPoints;
                if (pe.wageredPoints > o_2_playerMax) {
                    o_2_playerMax = pe.wageredPoints;
                    o_2_playerMaxName = `<@${pe.userId}>`;
                }
            }
        });
    }
    const predictionEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(`Choose between: **${p.outcome_1}** __OR__  **${p.outcome_2}**`)
        .addFields([
        {
            name: `PredictionID: `,
            value: `${p.predictionId}`,
            inline: false,
        },
        {
            name: `${p.outcome_1}`,
            value: `Points wagered: ${o_1_points} \n Highest Bet: ${o_1_playerMaxName}- ${o_1_playerMax === undefined ? 0 : o_1_playerMax} \n #Players: ${o_1_players} Players`,
            inline: true,
        },
        {
            name: `${p.outcome_2}`,
            value: `Points wagered: ${o_2_points} \n Highest Bet: ${o_2_playerMaxName} - ${o_2_playerMax} \n #Players: ${o_2_players} Players`,
            inline: true,
        },
        {
            name: `${time}`,
            value: "Seconds remaining...",
            inline: false,
        },
    ])
        .setTimestamp()
        .setFooter({
        text: "Prediction Bot",
    });
    const submitRow = new builders_1.ActionRowBuilder().addComponents((0, enter_prediction_buton_1.enterMessageButton)(predictionId), check_name_button_1.checkPointsMessageButton);
    return {
        content: "Prediction Open!!",
        embeds: [predictionEmbed],
        components: submitRow,
    };
};
exports.default = predictionStart;
