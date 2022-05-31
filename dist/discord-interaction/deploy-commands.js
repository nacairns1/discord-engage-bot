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
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_json_1 = require("../config.json");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("path"));
const { clientId, guildId } = require('../config.json');
const commandPath = path.resolve(__dirname, './commands');
const commands = new Array;
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js') && !file.includes('Interface'));
commandFiles.map(file => {
    const individualPath = path.resolve(commandPath, `./${file}`);
    console.log(`queueing command: ${individualPath}`);
    const command = require(individualPath).default;
    if (command.data === undefined)
        return;
    commands.push(command.data.toJSON());
});
const rest = new rest_1.REST({ version: '9' }).setToken(config_json_1.token);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Started refreshing application (/) commands.');
        yield rest.put(v9_1.Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
}))();
