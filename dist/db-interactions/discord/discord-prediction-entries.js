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
exports.updatePredictionEntry = exports.addNewPredictionEntry = void 0;
const discord_transactions_1 = require("./discord-transactions");
// returns null on failure to update prediction
const addNewPredictionEntry = (predictionId, userId, guildId, wageredPoints, predicted_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEntry = yield (0, discord_transactions_1.addNewDiscordPredictionEntry)(predictionId, userId, guildId, wageredPoints, predicted_outcome);
        return newEntry;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.addNewPredictionEntry = addNewPredictionEntry;
const updatePredictionEntry = (predictionId, userId, guildId, wageredPoints, predicted_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEntry = yield (0, discord_transactions_1.updateDiscordPredictionEntry)(predictionId, userId, guildId, wageredPoints, predicted_outcome);
        return updatedEntry;
    }
    catch (e) {
        console.error('error updating the prediction entry');
        console.error(e);
        return null;
    }
});
exports.updatePredictionEntry = updatePredictionEntry;
