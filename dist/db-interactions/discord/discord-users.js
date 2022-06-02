"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiscordUserManagerRole = exports.updateDiscordUserAdminRole = exports.addPointsToUserOnEngagement = exports.removePointsFromDiscordUserInGuild = exports.addPointsToDiscordUserInGuild = exports.addNewDiscordUserInGuild = void 0;
const userGuildMemberships_1 = require("../userGuildMemberships/userGuildMemberships");
const db_users_1 = require("../users/db-users");
const discord_transactions_1 = require("./discord-transactions");
// returns null on rejected added user from discordId
const addNewDiscordUserInGuild = async (discordId, guildId, points = 0, admin = false) => {
    try {
        const existingUGM = await (0, userGuildMemberships_1.findUserGuildMembership)(discordId, guildId);
        if (existingUGM) {
            console.log(`Existing User/Guild Membership detected ${existingUGM.userId} in ${existingUGM.guildId}. Returning without creating a new membership....`);
            return null;
        }
        const existingUser = await (0, db_users_1.findUser)(discordId);
        if (existingUser) {
            console.log(`Existing User detected. Creating a new guild membership in ${guildId}....`);
            const updatedUGM = await (0, userGuildMemberships_1.addNewUserGuildMembership)(discordId, guildId, points, admin);
            console.log(`membership updated for ${updatedUGM.userId} in ${guildId} to ${updatedUGM.points}`);
            return updatedUGM;
        }
        else {
            const newUser = await (0, db_users_1.addNewUser)(discordId);
            console.log(`New User created ${newUser.userId}. Adding new membership....`);
            const newUGM = await (0, userGuildMemberships_1.addNewUserGuildMembership)(discordId, guildId, points, admin);
            return newUGM;
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.addNewDiscordUserInGuild = addNewDiscordUserInGuild;
// returns null on rejected user update to add points
const addPointsToDiscordUserInGuild = async (discordId, guildId, pointsToAdd) => {
    try {
        const updatedUser = await (0, userGuildMemberships_1.incrementUserPoints)(discordId, guildId, pointsToAdd);
        if (updatedUser === null) {
            await (0, userGuildMemberships_1.addNewUserGuildMembership)(discordId, guildId, pointsToAdd);
        }
        console.log(`${discordId} updated points`);
        return updatedUser;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.addPointsToDiscordUserInGuild = addPointsToDiscordUserInGuild;
// returns null on rejected user update to remove points
const removePointsFromDiscordUserInGuild = async (discordId, guildId, pointsToRemove) => {
    try {
        const updatedUser = await (0, userGuildMemberships_1.incrementUserPoints)(discordId, guildId, pointsToRemove * -1);
        console.log(`${discordId} updated points`);
        return updatedUser;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.removePointsFromDiscordUserInGuild = removePointsFromDiscordUserInGuild;
const addPointsToUserOnEngagement = async (userId, guildId, pointsToAdd) => {
    try {
        const updatedUGM = await (0, discord_transactions_1.updateDiscordUserPointsOnEngagement)(userId, guildId, pointsToAdd);
        return updatedUGM;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.addPointsToUserOnEngagement = addPointsToUserOnEngagement;
const updateDiscordUserAdminRole = async (userId, guildId, admin) => {
    const prevUGM = await (0, userGuildMemberships_1.findUserGuildMembership)(userId, guildId);
    if (prevUGM === null)
        return null;
    if (prevUGM.admin === admin) {
        return null;
    }
    else {
        const newUGM = await (0, userGuildMemberships_1.updateUserAdminPrivilege)(userId, guildId, admin);
        return newUGM;
    }
};
exports.updateDiscordUserAdminRole = updateDiscordUserAdminRole;
const updateDiscordUserManagerRole = async (userId, guildId, manager) => {
    const prevUGM = await (0, userGuildMemberships_1.findUserGuildMembership)(userId, guildId);
    if (prevUGM === null)
        return null;
    console.log('updating manager status....');
    if (prevUGM.manager === manager) {
        return null;
    }
    else {
        const newUGM = await (0, userGuildMemberships_1.updateUserManagerPrivilege)(userId, guildId, manager);
        return newUGM;
    }
};
exports.updateDiscordUserManagerRole = updateDiscordUserManagerRole;
