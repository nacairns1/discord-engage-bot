"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const join_button_1 = require("../buttons/join-button");
const check_name_button_1 = require("../buttons/check-name-button");
const prediction_end_menu_1 = require("../context-menus/prediction-end-menu");
const enter_prediction_buton_1 = require("../buttons/enter-prediction-buton");
const prediction_enter_menu_1 = require("../context-menus/prediction-enter-menu");
const prediction_enter_modals_1 = require("../modals/prediction-enter-modals");
const interactionCreate = {
    name: "interactionCreate",
    async execute(interaction) {
        console.log(interaction);
        if (interaction.isButton()) {
            const button = interaction;
            const buttonId = button.customId;
            if (buttonId === 'user-join')
                await (0, join_button_1.addUserOnButtonClicked)(button);
            if (buttonId === 'user-check')
                await (0, check_name_button_1.checkPointsMessageButtonController)(button);
            if (buttonId.includes('user-enter'))
                await (0, enter_prediction_buton_1.enterUserOnButtonClicked)(button);
            return;
        }
        if (interaction.isSelectMenu()) {
            const msm = interaction;
            if (msm.customId === 'prediction-end')
                await (0, prediction_end_menu_1.predictionEndMenuController)(msm);
            if (msm.customId === 'prediction-enter')
                await (0, prediction_enter_menu_1.predictionEnterMenuController)(msm);
        }
        if (interaction.isModalSubmit()) {
            const ms = interaction;
            if (ms.customId === 'enter-modal')
                await (0, prediction_enter_modals_1.modalEnterSubmitHandler)(ms);
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
