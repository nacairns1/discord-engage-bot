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
exports.addNewDiscordGuild = void 0;
const db_guilds_1 = require("../guilds/db-guilds");
// returns null if rejected to add a new guild.
const addNewDiscordGuild = (discordGuildId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newGuild = yield (0, db_guilds_1.addNewGuild)(discordGuildId);
        if (newGuild === null)
            throw Error('error creating new guild');
        console.log(`added ${newGuild.guildId}`);
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.addNewDiscordGuild = addNewDiscordGuild;
