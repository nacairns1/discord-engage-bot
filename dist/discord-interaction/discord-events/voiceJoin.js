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
const index_1 = require("../index");
const discord_transactions_1 = require("../../db-interactions/discord/discord-transactions");
const checkVoiceState = (userId, guildId, pointsToAdd) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatePoints = yield (0, discord_transactions_1.updateDiscordUserPointsOnEngagement)(userId, guildId, pointsToAdd);
        return updatePoints;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
const voiceStateUpdate = {
    name: "voiceStateUpdate",
    execute(oldVoiceState, newVoiceState) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
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
                    (_b = index_1.client.intervals) === null || _b === void 0 ? void 0 : _b.delete(newUserId);
                }
                return;
            }
            else {
                const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield checkVoiceState(newUserId, guildId, 1000);
                }), 900000);
                // new voice state is the member joining or changing a voice channel.
                //  Initialize the interval for the user if they are not just changing the channel
                if ((_c = index_1.client.intervals) === null || _c === void 0 ? void 0 : _c.get(newUserId))
                    return;
                (_d = index_1.client.intervals) === null || _d === void 0 ? void 0 : _d.set(newUserId, timer);
                return;
            }
        });
    },
};
exports.default = voiceStateUpdate;
