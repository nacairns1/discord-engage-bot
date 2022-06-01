"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePredictionToClosed = exports.finishPrediction = exports.addNewPrediction = exports.findPredictionById = exports.getAllActivePredictions = exports.getAllPredictions = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const getAllPredictions = async () => {
    const predictions = await prisma.predictions.findMany();
    return predictions;
};
exports.getAllPredictions = getAllPredictions;
const getAllActivePredictions = async (guildId) => {
    const predictions = await prisma.predictions.findMany({ where: { guildId, active: true } });
    return predictions;
};
exports.getAllActivePredictions = getAllActivePredictions;
const findPredictionById = async (predictionId) => {
    const prediction = await prisma.predictions.findUnique({
        where: { predictionId },
    });
    return prediction;
};
exports.findPredictionById = findPredictionById;
const addNewPrediction = async (predictionId, guildId, creatorId, outcome_1, outcome_2, active = true, decided_outcome = "in progress...", timeCreated = (0, dayjs_1.default)().toISOString()) => {
    const predictionSearch = await (0, exports.findPredictionById)(predictionId);
    if (predictionSearch !== null) {
        console.log("duplicate prediction detected. returning...");
        return;
    }
    const newPrediction = await prisma.predictions.create({
        data: {
            predictionId,
            guildId,
            creatorId,
            outcome_1,
            outcome_2,
            active,
            isOpen: true,
            decided_outcome,
            timeCreated,
        },
    });
    console.log(newPrediction);
    return newPrediction;
};
exports.addNewPrediction = addNewPrediction;
const finishPrediction = async (predictionId, decided_outcome) => {
    const predictionSearch = await (0, exports.findPredictionById)(predictionId);
    if (predictionSearch === null || !predictionSearch.active) {
        console.log("Not active prediction found. returning....");
        return null;
    }
    const updatePrediction = await prisma.predictions.update({
        where: { predictionId },
        data: { decided_outcome, active: false, timeEnded: (0, dayjs_1.default)().toISOString() },
    });
    console.log(updatePrediction);
    return updatePrediction;
};
exports.finishPrediction = finishPrediction;
const updatePredictionToClosed = async (predictionId) => {
    const prediction = await (0, exports.findPredictionById)(predictionId);
    if (prediction === null) {
        console.log('null prediction found. returning null');
        return null;
    }
    if (!prediction.active) {
        console.log('inactive prediction found. Cannot change the open or closed status of a prediction past its initial time. Returning...');
        return null;
    }
    const updatePredictionToClosed = await prisma.predictions.update({ where: { predictionId }, data: { isOpen: false } });
    return updatePredictionToClosed;
};
exports.updatePredictionToClosed = updatePredictionToClosed;
