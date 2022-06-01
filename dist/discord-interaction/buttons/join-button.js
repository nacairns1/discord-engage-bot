"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserOnButtonClicked = exports.joinMessageButton = exports.joinButton = void 0;
const builders_1 = require("@discordjs/builders");
const v10_1 = require("discord-api-types/v10");
const discord_users_1 = require("../../db-interactions/discord/discord-users");
exports.joinButton = new builders_1.ButtonBuilder()
    .setCustomId("user-join")
    .setLabel("START POINTS!")
    .setStyle(v10_1.ButtonStyle.Primary);
exports.joinMessageButton = new builders_1.ButtonBuilder()
    .setCustomId("user-join")
    .setLabel("START POINTS!")
    .setStyle(v10_1.ButtonStyle.Primary);
const addUserOnButtonClicked = async (interaction) => {
    const user = interaction.user;
    const guild = interaction.guild;
    if (guild === null)
        return;
    try {
        const newUser = await (0, discord_users_1.addNewDiscordUserInGuild)(user.id, guild.id, 500, false);
        if (newUser === null) {
            await interaction.reply({
                content: `You're already registered in ${guild.name}`,
                ephemeral: true,
            });
        }
        else {
            await interaction.reply({
                content: `You're registered in server ${guild.name}! You've got ${newUser.points} to start.`,
                ephemeral: true,
            });
        }
    }
    catch (e) { }
};
exports.addUserOnButtonClicked = addUserOnButtonClicked;
