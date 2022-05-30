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
exports.finishPredictionAndRedeemWinners = exports.addNewPredictionInGuildByCreator = void 0;
const db_predictions_1 = require("../predictions/db-predictions");
const discord_transactions_1 = require("./discord-transactions");
const addNewPredictionInGuildByCreator = (discordPredictionId, guildId, creatorId, outcome_1, outcome_2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPrediction = yield (0, db_predictions_1.addNewPrediction)(discordPredictionId, guildId, creatorId, outcome_1, outcome_2);
        console.log(`New Prediction ${discordPredictionId} created by ${creatorId} in ${guildId}`);
        return newPrediction;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.addNewPredictionInGuildByCreator = addNewPredictionInGuildByCreator;
// returns the total pool entered, the amount of points the winners entered, and the highest winner
const finishPredictionAndRedeemWinners = (predictionId, decided_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const finishedPrediction = (0, discord_transactions_1.cashOutPlayers)(predictionId, decided_outcome);
        console.log(`finished prediction and redeemed player points.`);
        return finishedPrediction;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.finishPredictionAndRedeemWinners = finishPredictionAndRedeemWinners;
