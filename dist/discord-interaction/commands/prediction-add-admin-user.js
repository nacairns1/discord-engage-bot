"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
// add one specific admin to have the prediction admin privelege. Adds role if role is set for the server.
const predictionUserInit = {
    data: new builders_1.SlashCommandBuilder()
        .setName("prediction-add-admin")
        .setDescription("Grant a user admin prediction priveleges")
        .addUserOption((user) => user.setName("user").setDescription("user to change").setRequired(true)),
    async execute(interaction) {
        var _a;
        const oldUser = interaction.user.id;
        const newUser = (_a = interaction.options.getUser("user")) === null || _a === void 0 ? void 0 : _a.id;
        const guild = interaction.guildId;
        if (guild === null || newUser === undefined)
            return;
        const oldUserCheck = await (0, userGuildMemberships_1.findUserGuildMembership)(oldUser, guild);
        const newUserCheck = await (0, userGuildMemberships_1.findUserGuildMembership)(newUser, guild);
        if (oldUserCheck === null || !oldUserCheck.admin) {
            await interaction.user.send("Sorry, you don't have admin priveleges.");
            return;
        }
        if (newUserCheck === null) {
            await interaction.user.send("The requested user has not signed up");
            return;
        }
        if (newUserCheck.admin) {
            await interaction.user.send('The requested user already has admin priveleges');
            return;
        }
        else {
            await (0, userGuildMemberships_1.updateUserAdminPrivelege)(newUser, guild, true);
            return;
        }
    },
};
exports.default = predictionUserInit;
