"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinRowInMessage = exports.joinActionRow = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const check_name_button_1 = require("../buttons/check-name-button");
const join_button_1 = require("../buttons/join-button");
exports.joinActionRow = new builders_1.ActionRowBuilder().addComponents(join_button_1.joinButton);
exports.joinRowInMessage = new discord_js_1.MessageActionRow().addComponents(join_button_1.joinMessageButton, check_name_button_1.checkPointsMessageButton);
