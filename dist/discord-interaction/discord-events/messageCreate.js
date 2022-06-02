"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_guilds_1 = require("../../db-interactions/guilds/db-guilds");
const db_users_1 = require("../../db-interactions/users/db-users");
const discord_transactions_1 = require("../../db-interactions/discord/discord-transactions");
const messageCreate = {
    name: "messageCreate",
    async execute(interaction) {
        if (interaction.author.bot)
            return;
        const guildId = interaction.guildId;
        const userId = interaction.author.id;
        if (guildId === null)
            return;
        try {
            const isGuildActive = await (0, db_guilds_1.findGuild)(guildId);
            const isUserActive = await (0, db_users_1.findUser)(userId);
            if (!(isGuildActive && isUserActive))
                return;
            const engagementUpdate = await (0, discord_transactions_1.updateDiscordUserPointsOnEngagement)(userId, guildId, 100);
            if (engagementUpdate !== null)
                console.log(`activity points created for ${userId} in ${guildId} for a messageCreation event!`);
            return engagementUpdate;
        }
        catch (e) {
            console.error(e);
            return;
        }
    },
};
exports.default = messageCreate;
