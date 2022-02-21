/* eslint-disable brace-style */
const beginTracking = require('../buttons/beginTracking');
const receivePoints = require('../buttons/receivePoints');

module.exports = {
	name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const buttonID = interaction.component.customId;
        switch (buttonID) {
            case "beginTracking":
                beginTracking.execute(interaction);
                break;
            case "receivePoints":
                receivePoints.execute(interaction);
                break;
            default:
                break;
        }
    }
};
