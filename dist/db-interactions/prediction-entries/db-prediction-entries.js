"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPredictionEntryToPredictionId = exports.findPredictionByPredictionIdUserId = exports.findGuildUsersInPrediction = exports.getPredictionEntriesByPredictionId = exports.getAllPredictionEntries = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const getAllPredictionEntries = async () => {
    const predictionEntries = await prisma.predictionEntries.findMany();
    return predictionEntries;
};
exports.getAllPredictionEntries = getAllPredictionEntries;
const getPredictionEntriesByPredictionId = async (predictionId) => {
    const predictionEntries = await prisma.predictionEntries.findMany({
        where: { predictionId },
    });
    console.log(predictionEntries);
    return predictionEntries;
};
exports.getPredictionEntriesByPredictionId = getPredictionEntriesByPredictionId;
//finds all guild users in a given prediction
const findGuildUsersInPrediction = async (guildId, predictionId) => {
    const wagerers = await prisma.predictionEntries.findMany({ where: { guildId, predictionId } });
    return wagerers;
};
exports.findGuildUsersInPrediction = findGuildUsersInPrediction;
const findPredictionByPredictionIdUserId = async (predictionId, userId) => {
    const predictionEntry = await prisma.predictionEntries.findFirst({
        where: { predictionId, userId }
    });
    return predictionEntry;
};
exports.findPredictionByPredictionIdUserId = findPredictionByPredictionIdUserId;
const addPredictionEntryToPredictionId = async (predictionId, userId, guildId, predicted_outcome, wageredPoints) => {
    const userCheck = await (0, exports.findPredictionByPredictionIdUserId)(predictionId, userId);
    if (userCheck !== null) {
        console.log('duplicate prediction entry detected. returning...');
        return;
    }
    const newPredictionEntry = await prisma.predictionEntries.create({ data: {
            predictionId,
            userId,
            guildId,
            predicted_outcome,
            wageredPoints,
            earnedPoints: 0,
            timeCreated: (0, dayjs_1.default)().toISOString(),
        } });
    return newPredictionEntry;
};
exports.addPredictionEntryToPredictionId = addPredictionEntryToPredictionId;
