"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGuilds = exports.addCommandsToGuild = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_json_1 = require("../../config.json");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("path"));
const node_assert_1 = require("node:assert");
const db_guilds_1 = require("../../db-interactions/guilds/db-guilds");
const config_json_2 = require("../../config.json");
const addCommandsToGuild = async (guildId) => {
    const commandPath = path.resolve(__dirname, '../commands');
    const commands = new Array;
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js') && !file.includes('Interface'));
    commandFiles.map(file => {
        const individualPath = path.resolve(commandPath, `./${file}`);
        console.log(`queueing command: ${individualPath}`);
        const commandModule = require(individualPath).default;
        const command = commandModule;
        if (command.data === undefined)
            return;
        commands.push(command.data.toJSON());
    });
    const rest = new rest_1.REST({ version: '9' }).setToken(config_json_1.token);
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(v9_1.Routes.applicationGuildCommands(config_json_2.clientId, guildId), { body: commands });
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            console.error(error);
            return node_assert_1.rejects;
        }
    })();
};
exports.addCommandsToGuild = addCommandsToGuild;
const findGuildsToUpdate = async () => {
    const guilds = await (0, db_guilds_1.findAllGuilds)();
    return guilds;
};
const updateGuilds = async () => {
    const guilds = await findGuildsToUpdate();
    if (guilds === undefined)
        return;
    const promiseArr = [];
    guilds.map((g) => {
        console.log(g.guildId);
        promiseArr.push((0, exports.addCommandsToGuild)(g.guildId));
    });
    await Promise.all(promiseArr);
};
exports.updateGuilds = updateGuilds;
