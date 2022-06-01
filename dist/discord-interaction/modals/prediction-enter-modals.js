"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalEnterSubmitHandler = exports.predictionEntryModalGenerator = void 0;
const discord_js_1 = require("discord.js");
const predictionEntryModalGenerator = (predictionId, predicted_outcome) => {
    const pointsInput = new discord_js_1.TextInputComponent()
        .setCustomId("prediction-popup")
        .setLabel(`How many points do you want to wager?`)
        .setPlaceholder("MUST Be a Number")
        .setRequired(true)
        .setStyle("SHORT");
    const pidHolder = new discord_js_1.TextInputComponent()
        .setCustomId("modal-join-pid")
        .setValue(predictionId)
        .setLabel("***DO NOT TOUCH***")
        .setRequired(true)
        .setStyle("SHORT");
    const outHolder = new discord_js_1.TextInputComponent()
        .setCustomId("modal-join-out")
        .setLabel("***DO NOT TOUCH***")
        .setValue(predicted_outcome)
        .setStyle("SHORT");
    const hobbiesInput = new discord_js_1.MessageSelectMenu()
        .setCustomId("predicted-outcome")
        .addOptions({ value: `test`, label: `Outcome-1 ${predictionId}` }, { value: `test3`, label: `Outcome-2 ${predictionId}` });
    return new discord_js_1.Modal()
        .setCustomId(`enter-modal`)
        .setTitle(`Prediction Entry for ${predicted_outcome}`)
        .setComponents(new discord_js_1.MessageActionRow().setComponents(pointsInput), new discord_js_1.MessageActionRow().setComponents(hobbiesInput), new discord_js_1.MessageActionRow().setComponents(pidHolder), new discord_js_1.MessageActionRow().setComponents(outHolder));
};
exports.predictionEntryModalGenerator = predictionEntryModalGenerator;
const modalEnterSubmitHandler = async (interaction) => {
    console.log(interaction);
};
exports.modalEnterSubmitHandler = modalEnterSubmitHandler;
