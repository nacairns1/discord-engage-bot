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
const db_guilds_1 = require("../../db-interactions/guilds/db-guilds");
const db_users_1 = require("../../db-interactions/users/db-users");
const discord_transactions_1 = require("../../db-interactions/discord/discord-transactions");
const messageCreate = {
    name: "messageCreate",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.author.bot)
                return;
            const guildId = interaction.guildId;
            const userId = interaction.author.id;
            if (guildId === null)
                return;
            try {
                const isGuildActive = yield (0, db_guilds_1.findGuild)(guildId);
                const isUserActive = yield (0, db_users_1.findUser)(userId);
                if (!(isGuildActive && isUserActive))
                    return;
                yield (0, discord_transactions_1.updateDiscordUserPointsOnEngagement)(userId, guildId, 1000);
            }
            catch (e) {
                console.error(e);
                return;
            }
        });
    },
};
exports.default = messageCreate;
