"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_users_1 = require("../../db-interactions/discord/discord-users");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
// add one specific admin to have the prediction admin privilege. Adds role if role is set for the server.
const predictionManager = {
    data: new builders_1.SlashCommandBuilder()
        .setName("prediction-manager")
        .setDescription("Change a user's manager prediction privileges")
        .addUserOption((user) => user.setName("user").setDescription("user to change").setRequired(true))
        .addBooleanOption((b) => b
        .setDescription("true sets user to manager, false removes")
        .setName("manager")
        .setRequired(true)),
    async execute(interaction) {
        var _a;
        await interaction.deferReply({ ephemeral: true });
        const oldUser = interaction.user.id;
        const newUser = (_a = interaction.options.getUser("user")) === null || _a === void 0 ? void 0 : _a.id;
        const guild = interaction.guildId;
        const manager = interaction.options.get("manager", true).value;
        if (typeof manager !== "boolean")
            return null;
        if (guild === null || newUser === undefined)
            return;
        const oldUserCheck = await (0, userGuildMemberships_1.findUserGuildMembership)(oldUser, guild);
        const newUserCheck = await (0, userGuildMemberships_1.findUserGuildMembership)(newUser, guild);
        if (oldUserCheck === null || !oldUserCheck.admin) {
            await interaction.followUp({
                content: "You do not have admin privileges on this server.",
                ephemeral: true,
            });
            return;
        }
        if (newUserCheck === null) {
            await interaction.followUp({
                content: "The requested user has not signed up.",
                ephemeral: true,
            });
            return;
        }
        else {
            await (0, discord_users_1.updateDiscordUserManagerRole)(newUser, guild, manager);
            await interaction.followUp({
                content: `<@${newUser}> has manager status: ${manager}`,
                ephemeral: true,
            });
            return;
        }
    },
};
exports.default = predictionManager;
