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
const builders_1 = require("@discordjs/builders");
const v10_1 = require("discord-api-types/v10");
// initializes the guild in the prediction db. Necessary for other functionality.
// if given a channel, sends an initial message with a button to begin tracking as well as gain points.
// these values will be manual right now but can be refactored later and added to the db as default values and thus customizable.
const predictionUserInit = {
    data: new builders_1.SlashCommandBuilder()
        .setName("prediction-init-guild")
        .setDescription("Set up your guild for earning Prediction Points")
        .addSubcommand((subcommand) => subcommand
        .setName("info")
        .setDescription("sends intro information")
        .addChannelOption((channel) => channel
        .addChannelTypes(v10_1.ChannelType.GuildText)
        .setName("info-channel")
        .setDescription("Channel to send info only visible to you")
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName("initialize")
        .setDescription("Begins tracking prediction points")
        .addBooleanOption((bool) => bool
        .setName("guild")
        .setDescription("If true, members can begin earning points"))
        .addChannelOption((channel) => channel
        .addChannelTypes(v10_1.ChannelType.GuildText)
        .setName("init-channel")
        .setDescription("Sends public starting info to channel")
        .setRequired(true))),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const subcommand = interaction.options.getSubcommand();
            if (!interaction.inGuild()) {
                console.log('interaction not in guild. Returning...');
                return null;
            }
            // Subcommand info triggered. Sending ephemeral information into info channel
            if (subcommand === 'info') {
                const channelInfo = interaction.options.getChannel('info-channel');
                if (channelInfo === null)
                    return;
                const channelToSend = interaction.client.channels.cache.get(channelInfo.id);
                if (!channelToSend)
                    return;
            }
        });
    },
};
exports.default = predictionUserInit;
