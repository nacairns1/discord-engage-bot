"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictionEndOnButtonClicked = exports.endPredictionButton = void 0;
const v10_1 = require("discord-api-types/v10");
const discord_js_1 = require("discord.js");
const db_predictions_1 = require("../../db-interactions/predictions/db-predictions");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
const prediction_end_menu_1 = require("../context-menus/prediction-end-menu");
exports.endPredictionButton = new discord_js_1.ButtonBuilder()
    .setCustomId(`user-end`)
    .setLabel("END PREDICTION!")
    .setStyle(v10_1.ButtonStyle.Primary);
const predictionEndOnButtonClicked = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        if (guildId === null) {
            await interaction.followUp("Must use this command inside of a server");
            return;
        }
        const ugm = await (0, userGuildMemberships_1.findUserGuildMembership)(userId, guildId);
        if (ugm === null) {
            await interaction.followUp({
                content: "You were not found to be a registered member",
                ephemeral: true,
            });
            return;
        }
        if (!ugm.admin) {
            await interaction.followUp({
                content: "You do not have admin priveleges on this server",
                ephemeral: true,
            });
        }
        const rawContent = interaction.message.content;
        const splitContent = rawContent.split(' ');
        const predictionId = splitContent[splitContent.length - 1];
        if (typeof predictionId !== 'string') {
            interaction.followUp({
                content: "No prediction found with the given ID",
                ephemeral: true,
            });
            return;
        }
        const p = await (0, db_predictions_1.findPredictionById)(predictionId);
        if (p === null)
            throw Error("no prediction found");
        const { outcome_1, outcome_2 } = p;
        const selectMenu = (0, prediction_end_menu_1.predictionEndMenuFunc)(outcome_1, outcome_2);
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents([selectMenu]);
        await interaction.followUp({
            content: `End the prediction here for pid: ${predictionId}`,
            components: [actionRow],
            ephemeral: true,
        });
    }
    catch (e) {
        await interaction.followUp({ content: "error ending predictions", ephemeral: true });
        console.error(e);
    }
};
exports.predictionEndOnButtonClicked = predictionEndOnButtonClicked;
