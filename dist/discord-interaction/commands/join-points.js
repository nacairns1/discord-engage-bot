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
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const ping = {
    data: new builders_1.SlashCommandBuilder().setName("prediction-create").setDescription("Creates a new Prediction"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const predictionEmbed = new discord_js_1.MessageEmbed()
                .setTitle("Prediction Started!")
                .setDescription("Prediction outcomes: outcome_1, outcome_2")
                .addFields({ name: "Outcome_1", value: "xyz bettors", inline: true }, {
                name: "Points wagered: $$$$",
                value: "Highest Bettor: HAHAHAHHAHA",
                inline: false,
            }, { name: "Outcome_2", value: "123 bettors", inline: true }, {
                name: "Points wagered: $$$$",
                value: "Highest Bettor: HAHAHAHHAHA",
                inline: false,
            })
                .setTimestamp()
                .setFooter({
                text: "Prediction Bot",
            });
            const submitRow = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("button1")
                .setLabel("JOIN PREDICTION")
                .setStyle("PRIMARY"));
            yield interaction.reply({
                content: `Prediction Started in Channel ${interaction.channel}!`,
                embeds: [predictionEmbed],
                components: [submitRow],
            });
        });
    },
};
exports.default = ping;
