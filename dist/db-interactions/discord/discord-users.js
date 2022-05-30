"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPointsToUserOnEngagement = exports.removePointsFromDiscordUserInGuild = exports.addPointsToDiscordUserInGuild = exports.addDiscordUserInGuild = void 0;
const userGuildMemberships_1 = require("../userGuildMemberships/userGuildMemberships");
const db_users_1 = require("../users/db-users");
const discord_transactions_1 = require("./discord-transactions");
// returns null on rejected added user from discordId
const addDiscordUserInGuild = (discordId, guildId, points = 0, admin = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUGM = yield (0, userGuildMemberships_1.findUserGuildMembership)(discordId, guildId);
        if (existingUGM) {
            console.log(`Existing User/Guild Membership detected ${existingUGM.userId} in ${existingUGM.guildId}. Returning without creating a new membership....`);
            return null;
        }
        const existingUser = yield (0, db_users_1.findUser)(discordId);
        if (existingUser) {
            console.log(`Existing User detected. Creating a new guild membership....`);
            const updatedUGM = yield (0, userGuildMemberships_1.addNewUserGuildMembership)(discordId, guildId, points, admin);
            console.log(`membership updated for ${updatedUGM.userId} in ${guildId} to ${updatedUGM.points}`);
            return updatedUGM;
        }
        else {
            const newUser = yield (0, db_users_1.addNewUser)(discordId);
            console.log(`New User created ${newUser.userId}. Adding new membership....`);
            const newUGM = yield (0, userGuildMemberships_1.addNewUserGuildMembership)(discordId, guildId, points, admin);
            return newUGM;
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.addDiscordUserInGuild = addDiscordUserInGuild;
// returns null on rejected user update to add points
const addPointsToDiscordUserInGuild = (discordId, guildId, pointsToAdd) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, userGuildMemberships_1.incrementUserPoints)(discordId, guildId, pointsToAdd);
        if (updatedUser === null) {
            yield (0, userGuildMemberships_1.addNewUserGuildMembership)(discordId, guildId, pointsToAdd);
        }
        console.log(`${discordId} updated points`);
        return updatedUser;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.addPointsToDiscordUserInGuild = addPointsToDiscordUserInGuild;
// returns null on rejected user update to remove points
const removePointsFromDiscordUserInGuild = (discordId, guildId, pointsToRemove) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, userGuildMemberships_1.incrementUserPoints)(discordId, guildId, pointsToRemove * -1);
        console.log(`${discordId} updated points`);
        return updatedUser;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.removePointsFromDiscordUserInGuild = removePointsFromDiscordUserInGuild;
const addPointsToUserOnEngagement = (userId, guildId, pointsToAdd) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUGM = yield (0, discord_transactions_1.updateDiscordUserPointsOnEngagement)(userId, guildId, pointsToAdd);
        return updatedUGM;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.addPointsToUserOnEngagement = addPointsToUserOnEngagement;
