"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const join_button_1 = require("../buttons/join-button");
const check_name_button_1 = require("../buttons/check-name-button");
const prediction_end_menu_1 = require("../context-menus/prediction-end-menu");
const interactionCreate = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.isButton()) {
            const button = interaction;
            const buttonId = button.customId;
            if (buttonId === 'user-join')
                await (0, join_button_1.addUserOnButtonClicked)(button);
            if (buttonId === 'user-check')
                await (0, check_name_button_1.checkPointsMessageButtonController)(button);
            return;
        }
        if (interaction.isModalSubmit()) {
            // TO DO IMPLEMENT MODAL ROUTES
        }
        if (interaction.isSelectMenu()) {
            const msm = interaction;
            if (msm.customId === 'prediction-end')
                await (0, prediction_end_menu_1.predictionEndMenuController)(msm);
        }
        if (interaction.isCommand()) {
            if (index_1.client.commands === undefined)
                return;
            const command = index_1.client.commands.get(interaction.commandName);
            if (!command)
                return;
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    },
};
exports.default = interactionCreate;
