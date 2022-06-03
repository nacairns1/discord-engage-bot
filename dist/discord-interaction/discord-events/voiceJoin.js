"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const discord_transactions_1 = require("../../db-interactions/discord/discord-transactions");
const checkVoiceState = async (userId, guildId, pointsToAdd) => {
    try {
        const updatePoints = await (0, discord_transactions_1.updateDiscordUserPointsOnEngagement)(userId, guildId, pointsToAdd);
        if (updatePoints !== null)
            console.log(`activity points created for ${userId} in ${guildId} for a voice channel event!`);
        return updatePoints;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
const voiceStateUpdate = {
    name: "voiceStateUpdate",
    async execute(oldVoiceState, newVoiceState) {
        var _a, _b, _c, _d;
        const newUserId = newVoiceState.id;
        const guildId = newVoiceState.guild.id;
        // streaming support not implemented but referenced here for future implementation
        const { serverDeaf, selfDeaf, streaming, channelId } = newVoiceState;
        // new voice state is the member leaving the server or deafening
        // end the active interval for the user
        if (serverDeaf ||
            selfDeaf ||
            serverDeaf === null ||
            selfDeaf === null ||
            channelId === null) {
            const intervalToEnd = (_a = index_1.client.intervals) === null || _a === void 0 ? void 0 : _a.get(newUserId);
            if (intervalToEnd) {
                clearInterval(intervalToEnd);
                console.log(`voice activity points ended for ${newUserId} in ${guildId}!`);
                (_b = index_1.client.intervals) === null || _b === void 0 ? void 0 : _b.delete(newUserId);
            }
            return;
        }
        else {
            // new voice state is the member joining or changing a voice channel.
            //  Initialize the interval for the user if they are not just changing the channel
            if ((_c = index_1.client.intervals) === null || _c === void 0 ? void 0 : _c.get(newUserId))
                return;
            const timer = setInterval(async () => {
                await checkVoiceState(newUserId, guildId, 100);
            }, 900000);
            (_d = index_1.client.intervals) === null || _d === void 0 ? void 0 : _d.set(newUserId, timer);
            return;
        }
    },
};
exports.default = voiceStateUpdate;
