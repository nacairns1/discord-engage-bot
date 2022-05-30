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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPredictionEntryToPredictionId = exports.findPredictionByPredictionIdUserId = exports.findGuildUsersInPrediction = exports.getPredictionEntriesByPredictionId = exports.getAllPredictionEntries = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const getAllPredictionEntries = () => __awaiter(void 0, void 0, void 0, function* () {
    const predictionEntries = yield prisma.predictionEntries.findMany();
    return predictionEntries;
});
exports.getAllPredictionEntries = getAllPredictionEntries;
const getPredictionEntriesByPredictionId = (predictionId) => __awaiter(void 0, void 0, void 0, function* () {
    const predictionEntries = yield prisma.predictionEntries.findMany({
        where: { predictionId },
    });
    console.log(predictionEntries);
    return predictionEntries;
});
exports.getPredictionEntriesByPredictionId = getPredictionEntriesByPredictionId;
//finds all guild users in a given prediction
const findGuildUsersInPrediction = (guildId, predictionId) => __awaiter(void 0, void 0, void 0, function* () {
    const wagerers = yield prisma.predictionEntries.findMany({ where: { guildId, predictionId } });
    return wagerers;
});
exports.findGuildUsersInPrediction = findGuildUsersInPrediction;
const findPredictionByPredictionIdUserId = (predictionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const predictionEntry = yield prisma.predictionEntries.findFirst({
        where: { predictionId, userId }
    });
    return predictionEntry;
});
exports.findPredictionByPredictionIdUserId = findPredictionByPredictionIdUserId;
const addPredictionEntryToPredictionId = (predictionId, userId, guildId, predicted_outcome, wageredPoints) => __awaiter(void 0, void 0, void 0, function* () {
    const userCheck = yield (0, exports.findPredictionByPredictionIdUserId)(predictionId, userId);
    if (userCheck !== null) {
        console.log('duplicate prediction entry detected. returning...');
        return;
    }
    const newPredictionEntry = yield prisma.predictionEntries.create({ data: {
            predictionId,
            userId,
            guildId,
            predicted_outcome,
            wageredPoints,
            earnedPoints: 0,
            timeCreated: (0, dayjs_1.default)().toISOString(),
        } });
    return newPredictionEntry;
});
exports.addPredictionEntryToPredictionId = addPredictionEntryToPredictionId;
