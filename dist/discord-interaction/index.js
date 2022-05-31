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
exports.client = void 0;
const fs = __importStar(require("fs"));
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config.json");
const path = __importStar(require("path"));
class tsClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
    }
}
exports.client = new tsClient({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES
    ],
});
exports.client.commands = new discord_js_1.Collection();
exports.client.intervals = new discord_js_1.Collection();
const commandPath = path.resolve(__dirname, "./commands");
const eventPath = path.resolve(__dirname, "./discord-events");
const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js") && !file.includes('Interface'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`).default;
    exports.client.commands.set(command.data.name, command);
}
const eventFiles = fs
    .readdirSync(eventPath)
    .filter((file) => file.endsWith(".js") && !file.includes('Interface'));
for (const file of eventFiles) {
    const filePath = path.resolve(`${eventPath}`, `${file}`);
    const event = require(filePath).default;
    console.log(`adding listener for events: ${event.name}`);
    if (event.once) {
        exports.client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        exports.client.on(event.name, (...args) => event.execute(...args));
    }
}
try {
    exports.client.login(config_json_1.token);
    console.log(`logged into discord`);
}
catch (e) {
    console.error(e);
}
