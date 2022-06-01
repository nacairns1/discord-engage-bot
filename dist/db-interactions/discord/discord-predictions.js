"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllActivePredictionsInGuildId = exports.closePredictionToNewEntries = exports.finishPredictionAndRedeemWinners = exports.addNewPredictionInGuildByCreator = void 0;
const db_predictions_1 = require("../predictions/db-predictions");
const discord_transactions_1 = require("./discord-transactions");
const addNewPredictionInGuildByCreator = async (discordPredictionId, guildId, creatorId, outcome_1, outcome_2) => {
    try {
        const newPrediction = await (0, db_predictions_1.addNewPrediction)(discordPredictionId, guildId, creatorId, outcome_1, outcome_2);
        console.log(`New Prediction ${discordPredictionId} created by ${creatorId} in ${guildId}`);
        return newPrediction;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.addNewPredictionInGuildByCreator = addNewPredictionInGuildByCreator;
// returns the total pool entered, the amount of points the winners entered, and the highest winner
const finishPredictionAndRedeemWinners = async (predictionId, decided_outcome) => {
    try {
        const finishedPrediction = (0, discord_transactions_1.cashOutPlayers)(predictionId, decided_outcome);
        console.log(`finished prediction and redeemed player points.`);
        return finishedPrediction;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.finishPredictionAndRedeemWinners = finishPredictionAndRedeemWinners;
const closePredictionToNewEntries = async (predictionId) => {
    try {
        const predictionToClose = await (0, db_predictions_1.updatePredictionToClosed)(predictionId);
        return predictionToClose;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.closePredictionToNewEntries = closePredictionToNewEntries;
const getAllActivePredictionsInGuildId = async (guildId) => {
    try {
        const predictions = await (0, db_predictions_1.getAllActivePredictions)(guildId);
        return predictions;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.getAllActivePredictionsInGuildId = getAllActivePredictionsInGuildId;
