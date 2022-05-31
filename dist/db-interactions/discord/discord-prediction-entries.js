"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePredictionEntry = exports.addNewPredictionEntry = void 0;
const discord_transactions_1 = require("./discord-transactions");
// returns null on failure to update prediction
const addNewPredictionEntry = async (predictionId, userId, guildId, wageredPoints, predicted_outcome) => {
    try {
        const newEntry = await (0, discord_transactions_1.addNewDiscordPredictionEntry)(predictionId, userId, guildId, wageredPoints, predicted_outcome);
        return newEntry;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.addNewPredictionEntry = addNewPredictionEntry;
const updatePredictionEntry = async (predictionId, userId, guildId, wageredPoints, predicted_outcome) => {
    try {
        const updatedEntry = await (0, discord_transactions_1.updateDiscordPredictionEntry)(predictionId, userId, guildId, wageredPoints, predicted_outcome);
        return updatedEntry;
    }
    catch (e) {
        console.error('error updating the prediction entry');
        console.error(e);
        return null;
    }
};
exports.updatePredictionEntry = updatePredictionEntry;
