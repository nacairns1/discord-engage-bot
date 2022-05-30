import {
	PredictionEntries,
	PrismaClient,
	PrismaPromise,
	Users,
} from "@prisma/client";
import dayjs from "dayjs";

import { finishPrediction } from "./predictions/db-predictions";
import { findGuildUsersInPrediction } from "./prediction-entries/db-prediction-entries";

// change this section from a REST Api to an api for our discord bot to talk back and forth on the same application.
// No need to create a whole separate web server yet
const prisma = new PrismaClient();

export const cashOutPlayers = async (
	predictionId: string,
	decided_outcome: string
) => {
	const totalPool = await prisma.predictionEntries.aggregate({
		_sum: { wageredPoints: true },
		where: { predictionId },
	});
	const winnerPool = await prisma.predictionEntries.aggregate({
		_sum: { wageredPoints: true },
		where: { predictionId, predicted_outcome: decided_outcome },
	});
	let totalPoolSum: number;
	let winnerPoolSum: number;

	if (totalPool._sum.wageredPoints === null) return null; // no bets found
	if (winnerPool._sum.wageredPoints === null) return null; //no winners found]

	totalPoolSum = totalPool._sum.wageredPoints;
	winnerPoolSum = winnerPool._sum.wageredPoints;

	let winners = await prisma.predictionEntries.findMany({
		where: { predicted_outcome: decided_outcome, predictionId },
	});
	winners = winners.map((player) => {
		player.earnedPoints = Math.ceil(
			(player.wageredPoints / winnerPoolSum) * totalPoolSum
		);
		console.log(
			`${player.userId} earned ${player.earnedPoints} on a ${player.wageredPoints} wager`
		);
		return { ...player };
	});

	await prisma.predictionEntries.updateMany({
		where: { predictionId },
		data: {
			decided_outcome,
		},
	});

	//queue the prediction entries updates
	const updatedPlayers: PrismaPromise<PredictionEntries>[] = winners.map(
		(winner) => {
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
		}
	);

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
	await prisma.$transaction([ ...updatedPlayers]);
	console.log("successfully updated winners points");
};

cashOutPlayers("prediction 1", "defeat");
