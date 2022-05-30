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
exports.updateDiscordUserPointsOnEngagement = exports.updateDiscordPredictionEntry = exports.addNewDiscordPredictionEntry = exports.cashOutPlayers = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
// change this section from a REST Api to an api for our discord bot to talk back and forth on the same application.
// No need to create a whole separate web server yet
const prisma = new client_1.PrismaClient();
const cashOutPlayers = (predictionId, decided_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    const prediction = yield prisma.predictions.findUnique({
        where: { predictionId },
    });
    if (prediction === null) {
        console.log("no prediction found. returning....");
        return;
    }
    if (!prediction.active) {
        console.log("inactive prediction found. returning without updating...");
        return;
    }
    let allPlayers = yield prisma.predictionEntries.findMany({
        where: { predictionId },
    });
    let totalSum = 0;
    let winnerSum = 0;
    let topWinner;
    allPlayers.map((player) => {
        totalSum += player.wageredPoints;
        if (player.predicted_outcome === decided_outcome) {
            if (topWinner === undefined ||
                topWinner.wageredPoints < player.wageredPoints) {
                topWinner = player;
            }
            winnerSum += player.wageredPoints;
        }
    });
    console.log(`total sum: ${totalSum}`);
    console.log(`winner sum: ${winnerSum}`);
    //queue the prediction update
    let predictionUpdate = prisma.predictions.update({
        where: { predictionId },
        data: { timeEnded: (0, dayjs_1.default)().toISOString(), decided_outcome, active: false },
    });
    //queue the prediction entries update
    let allPredictionEntriesUpdateQueue = allPlayers.map((player) => {
        const { predictionId, userId, guildId } = player;
        if (player.predicted_outcome === decided_outcome) {
            player.earnedPoints = (player.wageredPoints / winnerSum) * totalSum;
        }
        let updatePromise = prisma.predictionEntries.update({
            where: {
                predictionId_userId_guildId: { predictionId, userId, guildId },
            },
            data: { decided_outcome, earnedPoints: player.earnedPoints },
        });
        return updatePromise;
    });
    // queue the userGuildMemberships update
    let allUsersGuildMembershipsUpdateQueue = allPlayers
        .filter((player) => {
        return player.predicted_outcome === decided_outcome;
    })
        .map((player) => {
        const { userId, guildId } = player;
        const pointsToAdd = player.earnedPoints;
        console.log(`queuing update for ${userId} in ${guildId}...`);
        let updatePromise = prisma.userGuildMemberships.update({
            where: { userId_guildId: { userId, guildId } },
            data: {
                points: {
                    increment: pointsToAdd,
                },
            },
        });
        return updatePromise;
    });
    try {
        yield prisma.$transaction([
            predictionUpdate,
            ...allPredictionEntriesUpdateQueue,
            ...allUsersGuildMembershipsUpdateQueue,
        ]);
        console.log("successfully updated gm's, prediction, and prediction entries");
        return { totalSum, winnerSum, topWinner };
    }
    catch (e) {
        console.error("error cashing out players");
        console.error(e);
        return null;
    }
});
exports.cashOutPlayers = cashOutPlayers;
const addNewDiscordPredictionEntry = (predictionId, userId, guildId, wageredPoints, predicted_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUGM = yield prisma.userGuildMemberships.findUnique({
        where: { userId_guildId: { userId, guildId } },
    });
    if (foundUGM === null) {
        console.error(" no user found. returning null...");
        return null;
    }
    if (foundUGM.points === 0) {
        console.log("no points for found user");
        return foundUGM;
    }
    if (foundUGM.points < wageredPoints && foundUGM.points !== 0) {
        console.error("Too many points wagered. Going all in...");
        const updatedUGM = prisma.userGuildMemberships.update({
            where: { userId_guildId: { userId, guildId } },
            data: {
                points: {
                    decrement: foundUGM.points,
                },
            },
        });
        const newPredictionEntry = prisma.predictionEntries.create({
            data: {
                userId,
                guildId,
                predictionId,
                wageredPoints: foundUGM.points,
                predicted_outcome,
                timeCreated: (0, dayjs_1.default)().toISOString(),
                earnedPoints: 0,
            },
        });
        console.log("attempting user update and prediction entry creation...");
        yield prisma.$transaction([updatedUGM, newPredictionEntry]);
        return { predictionId, userId, guildId, wageredPoints, predicted_outcome };
    }
    // less points wagerd than available in UGM
    const updatedUGM = prisma.userGuildMemberships.update({
        where: { userId_guildId: { userId, guildId } },
        data: {
            points: {
                decrement: wageredPoints,
            },
        },
    });
    const newPredictionEntry = prisma.predictionEntries.create({
        data: {
            userId,
            guildId,
            predictionId,
            wageredPoints,
            predicted_outcome,
            timeCreated: (0, dayjs_1.default)().toISOString(),
            earnedPoints: 0,
        },
    });
    yield prisma.$transaction([updatedUGM, newPredictionEntry]);
    return { predictionId, userId, guildId, wageredPoints, predicted_outcome };
});
exports.addNewDiscordPredictionEntry = addNewDiscordPredictionEntry;
const updateDiscordPredictionEntry = (predictionId, userId, guildId, wageredPoints, predicted_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPredictionEntry = yield prisma.predictionEntries.findUnique({
        where: { predictionId_userId_guildId: { predictionId, userId, guildId } },
    });
    if (foundPredictionEntry === null) {
        console.error("no user found to update");
        return null;
    }
    const ugm = yield prisma.userGuildMemberships.findUnique({
        where: { userId_guildId: { userId, guildId } },
    });
    if (ugm === null) {
        console.error("no ugm found to update");
        return null;
    }
    // case found where more points must be taken out of user balance (same side of wager. increasing amount of points)
    if (foundPredictionEntry.predicted_outcome === predicted_outcome) {
        // case found where too many points were bet. Going all in...
        if (ugm.points > wageredPoints) {
            const updatedUgm = prisma.userGuildMemberships.update({
                where: { userId_guildId: { userId, guildId } },
                data: {
                    points: {
                        decrement: ugm.points,
                    },
                },
            });
            const updatedPe = prisma.predictionEntries.update({
                where: {
                    predictionId_userId_guildId: {
                        predictionId,
                        userId,
                        guildId,
                    },
                },
                data: {
                    wageredPoints: {
                        increment: ugm.points,
                    },
                },
            });
            // transaction to update the UGM and PE
            console.log("attempting updated wager...");
            yield prisma.$transaction([updatedUgm, updatedPe]);
            return { predicted_outcome, points: ugm.points };
        }
        // case where we are adding points but still have points leftover
        const updatedUgm = prisma.userGuildMemberships.update({
            where: { userId_guildId: { userId, guildId } },
            data: {
                points: {
                    decrement: wageredPoints,
                },
            },
        });
        const updatedPe = prisma.predictionEntries.update({
            where: {
                predictionId_userId_guildId: {
                    predictionId,
                    userId,
                    guildId,
                },
            },
            data: {
                wageredPoints: {
                    increment: wageredPoints,
                },
            },
        });
        // transaction to update the UGM and PE
        console.log("attempting updated wager with points remaining (same side)...");
        yield prisma.$transaction([updatedUgm, updatedPe]);
        return { points: wageredPoints, predicted_outcome };
    }
    // case found where points must be reallocated to new side of wager
    // case where the found prediction entry has a lesser amount than the new prediction entry (increasing total amount wagered on different side)
    //  |
    //  |---> switch to new wagered amount if possible (all in otherwise), update the ugm
    if (foundPredictionEntry.wageredPoints < wageredPoints) {
        const difference = wageredPoints - foundPredictionEntry.wageredPoints;
        // case where the difference is too much in the account and so the player goes all in
        if (ugm.points < difference) {
            const updatedUgm = prisma.userGuildMemberships.update({
                where: { userId_guildId: { userId, guildId } },
                data: { points: { decrement: ugm.points } },
            });
            const updatedPE = prisma.predictionEntries.update({
                where: {
                    predictionId_userId_guildId: { predictionId, userId, guildId },
                },
                data: { predicted_outcome, wageredPoints: { increment: ugm.points } },
            });
            yield prisma.$transaction([updatedUgm, updatedPE]);
            return {
                predicted_outcome,
                points: ugm.points + foundPredictionEntry.wageredPoints,
            };
        }
        // case where the difference in the account is not too much and so the player has zero or more points remaining. decrements by wageredPoints
        const updatedUgm = prisma.userGuildMemberships.update({
            where: { userId_guildId: { userId, guildId } },
            data: { points: { decrement: wageredPoints } },
        });
        const updatedPE = prisma.predictionEntries.update({
            where: { predictionId_userId_guildId: { predictionId, userId, guildId } },
            data: { predicted_outcome, wageredPoints: wageredPoints },
        });
        // returns the predicted outcome and the new amount of wagered points
        yield prisma.$transaction([updatedUgm, updatedPE]);
        return {
            predicted_outcome,
            points: wageredPoints,
        };
    }
    // case where the found prediction entry has an equal amount to the new prediction entry
    //  |
    //  |---> switch to new side of prediction, no update necessary to ugm
    if (foundPredictionEntry.wageredPoints === wageredPoints) {
        const updatedPE = prisma.predictionEntries.update({
            where: { predictionId_userId_guildId: { predictionId, userId, guildId } },
            data: { predicted_outcome, wageredPoints },
        });
        yield prisma.$transaction([updatedPE]);
        return { predicted_outcome, points: wageredPoints };
    }
    else {
        // case where the found prediction entry has a greater amount than the new prediction entry
        //  |
        //  |---> switch to new wagered amount, refund the difference to the ugm
        const refund = wageredPoints - foundPredictionEntry.wageredPoints;
        const updatedUgm = prisma.userGuildMemberships.update({
            where: { userId_guildId: { userId, guildId } },
            data: { points: { increment: refund } },
        });
        const updatedPE = prisma.predictionEntries.update({
            where: { predictionId_userId_guildId: { predictionId, userId, guildId } },
            data: { predicted_outcome, wageredPoints: wageredPoints },
        });
        yield prisma.$transaction([updatedUgm, updatedPE]);
        return { predicted_outcome, points: wageredPoints };
    }
});
exports.updateDiscordPredictionEntry = updateDiscordPredictionEntry;
const updateDiscordUserPointsOnEngagement = (userId, guildId, pointsToAdd) => __awaiter(void 0, void 0, void 0, function* () {
    const now = (0, dayjs_1.default)();
    const ugm = yield prisma.userGuildMemberships.findUnique({
        where: { userId_guildId: { userId, guildId } },
    });
    if (ugm === null) {
        console.error("no user found");
        return null;
    }
    const timeDiff = now.diff(ugm.lastEarnedPonts, "minutes");
    // case where its default last time earned points aka never OR past the requisite amount of time to earn points (15 minutes)
    if (ugm.lastEarnedPonts == "" || timeDiff >= 15) {
        //attempt adding the points to the found ugm
        const updatedUGM = yield prisma.userGuildMemberships.update({
            where: { userId_guildId: { userId, guildId } },
            data: { points: { increment: pointsToAdd }, lastEarnedPonts: now.toISOString() },
        });
        return updatedUGM;
    }
    // case where its too soon
    return null;
});
exports.updateDiscordUserPointsOnEngagement = updateDiscordUserPointsOnEngagement;
