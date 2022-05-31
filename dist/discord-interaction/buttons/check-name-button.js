"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPointsMessageButtonController = exports.checkPointsMessageButton = void 0;
const discord_js_1 = require("discord.js");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
exports.checkPointsMessageButton = new discord_js_1.MessageButton()
    .setCustomId("user-check")
    .setLabel("CHECK POINTS!")
    .setStyle("SECONDARY");
const checkPointsMessageButtonController = async (interaction) => {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    if (guildId === null)
        return;
    try {
        const user = await (0, userGuildMemberships_1.findUserGuildMembership)(userId, guildId);
        if (user === null)
            throw Error('No user found');
        await interaction.reply({ content: `Points: ${user.points}`, ephemeral: true });
    }
    catch (e) {
        await interaction.reply({ content: 'You have not been registered yet!', ephemeral: true });
    }
};
exports.checkPointsMessageButtonController = checkPointsMessageButtonController;
