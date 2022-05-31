"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewDiscordGuild = void 0;
const db_guilds_1 = require("../guilds/db-guilds");
// returns null if rejected to add a new guild.
const addNewDiscordGuild = async (discordGuildId) => {
    try {
        const newGuild = await (0, db_guilds_1.addNewGuild)(discordGuildId);
        if (newGuild === null)
            throw Error('error creating new guild');
        console.log(`added ${newGuild.guildId}`);
        return newGuild;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.addNewDiscordGuild = addNewDiscordGuild;
