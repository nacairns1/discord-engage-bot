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
const cashOutPlayers = (predictionId, guildId, decided_outcome) => __awaiter(void 0, void 0, void 0, function* () {
    const totalPool = yield prisma.predictionEntries.aggregate({
        _sum: { wageredPoints: true },
        where: { predictionId },
    });
    let totalPoolSum;
    if (totalPool._sum.wageredPoints === null)
        return null; // no bets found
    totalPoolSum = totalPool._sum.wageredPoints;
    console.log(`total pool: ${totalPool}`);
    const victoryPlayers = yield prisma.predictionEntries.findMany({
        where: { predicted_outcome: decided_outcome },
    });
    let victoryPool = victoryPlayers.reduce((a, b) => {
        return a + b.wageredPoints;
    }, 0);
    let payout = victoryPlayers.map((p) => {
        let addedPoints = (p.wageredPoints / victoryPool) * totalPoolSum;
        return { userId: p.userId, guildId: p.guildId, points: addedPoints };
    });
    console.log(victoryPlayers);
    console.log(payout);
    const defeatPlayers = yield prisma.predictionEntries.findMany({
        where: {
            NOT: { predicted_outcome: decided_outcome },
        },
    });
    console.log(defeatPlayers);
    defeatPlayers.map((p) => {
        let lostPoints = p.wageredPoints;
        payout.push({ userId: p.userId, guildId: p.guildId, points: lostPoints });
    });
    console.log(payout);
    // iterates through the players and updates their points
    for (let i = 0; i < payout.length; i++) {
        const { userId, guildId, points } = payout[i];
        const updatePoints = points;
        const User = yield prisma.users.findFirst({ where: { guildId, userId } });
        if (User !== null) {
            const { id, points } = User;
            console.log(`updating ${User.userId} in ${User.guildId} to points: ${points + updatePoints}`);
            yield prisma.users.update({ where: { id: id }, data: { points: points + updatePoints } });
        }
    }
});
exports.cashOutPlayers = cashOutPlayers;
(0, exports.cashOutPlayers)("prediction 1", "Fun Guild", "Victory");
