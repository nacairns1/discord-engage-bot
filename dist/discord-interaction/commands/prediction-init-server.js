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
        .setName("prediction-init-server")
        .setDescription("Set up bot")
        .addSubcommand((subcommand) => subcommand
        .setName("info")
        .setDescription("sends intro information"))
        .addSubcommand((subcommand) => subcommand
        .setName("initialize")
        .setDescription("Begins points watching")
        .addBooleanOption((bool) => bool
        .setName("guild")
        .setDescription("Can members earn points?")
        .setRequired(true))
        .addChannelOption((channel) => channel
        .addChannelTypes(v10_1.ChannelType.GuildText)
        .setName("init-channel")
        .setDescription("Sends public starting info")
        .setRequired(true))),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const subcommand = interaction.options.getSubcommand();
            if (!interaction.inGuild()) {
                console.log("interaction not in guild. Returning...");
                return null;
            }
            // Subcommand info triggered. Sending ephemeral information into info channel
            if (subcommand === "info") {
                const content = `This bot tracks the engagement of users in your server and allocates points to your users.

                In order to do so, this application notices when users are active in the server. This includes sending messages, joining voice, reacting to content, etc.
                
                Besides the time of the interaction, no information about the messages or voice content are stored.
                
                Predictions are the notable feature of this bot. Type /prediction-start to start a new prediction. 
                
                The relevant information stored about these predictions are the user chosen outcomes and the eventual decided outcomes. This is how the bot can parse whether users win or lose.
                
                The bot aims to be as minimalistic as possible to not infringe on your discord experience. The full list of stored data is available on this [projects github](https://github.com/nacairns1/discord-engage-bot)
                
                To get started in your server, type \`/prediction-init-guild initialize\` to activate the bot's full capabilities.  
                
                More command information is available via \`/prediction-help\`.`;
                const dm = interaction.user.send(content);
                console.log('attempting sending introductory information to requested user');
                return yield dm;
            }
        });
    },
};
exports.default = predictionUserInit;
