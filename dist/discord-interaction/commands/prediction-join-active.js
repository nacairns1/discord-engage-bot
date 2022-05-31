"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
// the user joins the active prediction with the given id.
const predictionUserInit = {
    data: new builders_1.SlashCommandBuilder().setName("prediction-join-active").setDescription("Joins an active prediction"),
    async execute(interaction) {
    }
};
exports.default = predictionUserInit;
