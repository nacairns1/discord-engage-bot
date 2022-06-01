"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const discord_users_1 = require("../../db-interactions/discord/discord-users");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
// returns the points for the invoking user
const predictionAddAdminRole = {
    data: new builders_1.SlashCommandBuilder()
        .setName("prediction-change-admin-role")
        .setDescription("Change admin status of CURRENT users w/ role")
        .addRoleOption((role) => role
        .setName("role")
        .setDescription("DANGER opted-in users will be granted admin")
        .setRequired(true))
        .addBooleanOption((b) => b
        .setDescription("true sets user to admin, false removes")
        .setName("admin")
        .setRequired(true)),
    async execute(interaction) {
        var _a;
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.user;
        const guildId = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        const admin = interaction.options.get("admin", true).value;
        if (guildId === undefined || typeof admin !== "boolean")
            return;
        const userCheck = await (0, userGuildMemberships_1.findUserGuildMembership)(user.id, guildId);
        if (userCheck === null || !userCheck.admin) {
            interaction.followUp({
                content: "You do not have admin priveleges.",
                ephemeral: true,
            });
            return;
        }
        const role = interaction.options.get("role", true).role;
        if (role === null || role === undefined) {
            await interaction.followUp({
                ephemeral: true,
                content: "Insufficient role selected.",
            });
            return;
        }
        if (interaction.guild === null)
            return;
        const guildMembers = await interaction.guild.members.fetch();
        console.log(guildMembers);
        // queue up update role priveleges if user already has opted in.
        const guildMemberUpdateQueue = guildMembers
            .filter((member) => {
            return member.roles.cache.has(role.id);
        })
            .map((member) => {
            let updatePromise = (0, discord_users_1.updateDiscordUserAdminRole)(member.id, guildId, admin);
            return updatePromise;
        });
        try {
            const updatedUsers = await Promise.all([guildMemberUpdateQueue]);
            const roleSF = (0, discord_js_1.roleMention)(role.id);
            if (admin) {
                await interaction.followUp({
                    content: `${roleSF} has been given admin priveleges!`,
                });
            }
            else {
                await interaction.followUp({
                    content: `${roleSF} has had admin priveleges removed!`,
                });
            }
            return;
        }
        catch (e) {
            await interaction.followUp({
                content: "Error when adding role members to admin priveleges",
                ephemeral: true,
            });
            return;
        }
    },
};
exports.default = predictionAddAdminRole;
