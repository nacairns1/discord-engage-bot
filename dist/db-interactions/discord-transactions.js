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
exports.cashOutPlayers = void 0;
const client_1 = require("@prisma/client");
// change this section from a REST Api to an api for our discord bot to talk back and forth on the same application.
// No need to create a whole separate web server yet
const prisma = new client_1.PrismaClient();
const cashOutPlayers = (predictionId, decided_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    const totalPool = yield prisma.predictionEntries.aggregate({
        _sum: { wageredPoints: true },
        where: { predictionId },
    });
    const winnerPool = yield prisma.predictionEntries.aggregate({
        _sum: { wageredPoints: true },
        where: { predictionId, predicted_outcome: decided_outcome },
    });
    let totalPoolSum;
    let winnerPoolSum;
    if (totalPool._sum.wageredPoints === null)
        return null; // no bets found
    if (winnerPool._sum.wageredPoints === null)
        return null; //no winners found]
    totalPoolSum = totalPool._sum.wageredPoints;
    winnerPoolSum = winnerPool._sum.wageredPoints;
    let winners = yield prisma.predictionEntries.findMany({
        where: { predicted_outcome: decided_outcome, predictionId },
    });
    winners = winners.map((player) => {
        player.earnedPoints = Math.ceil((player.wageredPoints / winnerPoolSum) * totalPoolSum);
        console.log(`${player.userId} earned ${player.earnedPoints} on a ${player.wageredPoints} wager`);
        return Object.assign({}, player);
    });
    yield prisma.predictionEntries.updateMany({
        where: { predictionId },
        data: {
            decided_outcome,
        },
    });
    //queue the prediction entries updates
    const updatedPlayers = winners.map((winner) => {
        return prisma.predictionEntries.update({
            data: { earnedPoints: winner.earnedPoints },
            where: {
                predictionId_userId_guildId: {
                    predictionId: winner.predictionId,
                    userId: winner.userId,
                    guildId: winner.userId,
                },
            },
        });
    });
    console.log(updatedPlayers);
    //maps the array of player scores to update
    // const updatingScores: PrismaPromise<any>[] = winners.map((winner) => {
    // 	console.log(`queueing update for player ${winner.userId}`);
    // 	let userPromise = prisma.users.update({
    // 		data: { points: { increment: winner.earnedPoints } },
    // 		where: {
    // 			userId_guildId: {
    // 				userId: winner.userId,
    // 				guildId: winner.guildId,
    // 			},
    // 		},
    // 	});
    // 	return userPromise;
    // });
    //updates all of the scores in an all-or-nothing transaction 
    // ********
    // RE - ADD ...updatingScores,
    // ********
    yield prisma.$transaction([...updatedPlayers]);
    console.log("successfully updated winners points");
});
exports.cashOutPlayers = cashOutPlayers;
(0, exports.cashOutPlayers)("prediction 1", "defeat");
