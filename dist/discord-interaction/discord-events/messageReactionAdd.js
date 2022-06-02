"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_transactions_1 = require("../../db-interactions/discord/discord-transactions");
const db_guilds_1 = require("../../db-interactions/guilds/db-guilds");
const db_users_1 = require("../../db-interactions/users/db-users");
const messageReactionAdd = {
    name: "messageReactionAdd",
    async execute(interaction, user) {
        if (!interaction.message.guildId || user.bot)
            return;
        const guildId = interaction.message.guildId;
        const userId = user.id;
        if (guildId === null)
            return;
        try {
            const isGuildActive = await (0, db_guilds_1.findGuild)(guildId);
            const isUserActive = await (0, db_users_1.findUser)(userId);
            if (!(isGuildActive && isUserActive))
                return;
            await (0, discord_transactions_1.updateDiscordUserPointsOnEngagement)(userId, guildId, 100);
        }
        catch (e) {
            console.error(e);
            return;
        }
    },
};
exports.default = messageReactionAdd;
