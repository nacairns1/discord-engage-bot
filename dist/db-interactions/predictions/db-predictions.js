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
exports.finishPrediction = exports.addNewPrediction = exports.findPredictionById = exports.getAllPredictions = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const getAllPredictions = () => __awaiter(void 0, void 0, void 0, function* () {
    const predictions = yield prisma.predictions.findMany();
    return predictions;
});
exports.getAllPredictions = getAllPredictions;
const findPredictionById = (predictionId) => __awaiter(void 0, void 0, void 0, function* () {
    const prediction = yield prisma.predictions.findUnique({
        where: { predictionId },
    });
    return prediction;
});
exports.findPredictionById = findPredictionById;
const addNewPrediction = (predictionId, guildId, creatorId, outcome_1, outcome_2, active = true, decided_outcome = "in progress...", timeCreated = (0, dayjs_1.default)().toISOString()) => __awaiter(void 0, void 0, void 0, function* () {
    const predictionSearch = yield (0, exports.findPredictionById)(predictionId);
    if (predictionSearch !== null) {
        console.log("duplicate prediction detected. returning...");
        return;
    }
    const newPrediction = yield prisma.predictions.create({
        data: {
            predictionId,
            guildId,
            creatorId,
            outcome_1,
            outcome_2,
            active,
            decided_outcome,
            timeCreated,
        },
    });
    console.log(newPrediction);
    return newPrediction;
});
exports.addNewPrediction = addNewPrediction;
const finishPrediction = (predictionId, decided_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    const predictionSearch = yield (0, exports.findPredictionById)(predictionId);
    if (predictionSearch === null || !predictionSearch.active) {
        console.log("Not active prediction found. returning....");
        return;
    }
    const updatePrediction = yield prisma.predictions.update({
        where: { predictionId },
        data: { decided_outcome, active: false, timeEnded: (0, dayjs_1.default)().toISOString() },
    });
    console.log(updatePrediction);
});
exports.finishPrediction = finishPrediction;
