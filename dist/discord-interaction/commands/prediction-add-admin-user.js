"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
// add one specific admin to have the prediction admin privilege. Adds role if role is set for the server.
const predictionAdmin = {
    data: new builders_1.SlashCommandBuilder()
        .setName("prediction-admin")
        .setDescription("Change a user's admin prediction privileges")
        .addUserOption((user) => user.setName("user").setDescription("user to change").setRequired(true))
        .addBooleanOption((b) => b
        .setDescription("true sets user to admin, false removes")
        .setName("admin")
        .setRequired(true)),
    async execute(interaction) {
        var _a;
        await interaction.deferReply({ ephemeral: true });
        const oldUser = interaction.user.id;
        const newUser = (_a = interaction.options.getUser("user")) === null || _a === void 0 ? void 0 : _a.id;
        const guild = interaction.guildId;
        const admin = interaction.options.get("admin", true).value;
        if (typeof admin !== "boolean")
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
            await (0, userGuildMemberships_1.updateUserAdminPrivilege)(newUser, guild, admin);
            await interaction.followUp({
                content: `<@${newUser}> has Admin status: ${admin}`,
                ephemeral: true,
            });
            return;
        }
    },
};
exports.default = predictionAdmin;
