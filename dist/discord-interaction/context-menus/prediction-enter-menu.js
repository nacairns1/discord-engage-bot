"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictionEnterMenuController = exports.predictionEnterMenuFunc = void 0;
const discord_js_1 = require("discord.js");
const prediction_enter_modals_1 = require("../modals/prediction-enter-modals");
const predictionEnterMenuFunc = (pid, outcome_1, outcome_2) => new discord_js_1.MessageSelectMenu()
    .setCustomId("prediction-enter")
    .setPlaceholder("SELECTING AN OPTION OPENS A PREDICTION INPUT")
    .addOptions([
    {
        label: `${outcome_1}`,
        description: "Select this to enter the prediction",
        value: `${outcome_1}`,
    },
    {
        label: `${outcome_2}`,
        description: "Select this to enter the prediction",
        value: `${outcome_2}`,
    },
]);
exports.predictionEnterMenuFunc = predictionEnterMenuFunc;
const predictionEnterMenuController = async (interaction) => {
    const rawContent = interaction.message.content;
    const splitContent = rawContent.split(' ');
    const pid = splitContent[splitContent.length - 1];
    console.log(interaction.component);
    console.log(interaction.values);
    const predicted_outcome = interaction.values[0];
    console.log(`opening prediction popup ${pid} for user ${interaction.user.id} in guild ${interaction.guildId}`);
    const modal = (0, prediction_enter_modals_1.predictionEntryModalGenerator)(pid, predicted_outcome);
    interaction.showModal(modal);
    try {
    }
    catch (e) {
        await interaction.reply({ content: 'Error when entering the prediction. Please try again.', ephemeral: true });
    }
};
exports.predictionEnterMenuController = predictionEnterMenuController;
