import { PrismaClient, Users } from "@prisma/client";
import dayjs from "dayjs";

import { finishPrediction } from "./predictions/db-predictions";

// change this section from a REST Api to an api for our discord bot to talk back and forth on the same application.
// No need to create a whole separate web server yet
const prisma = new PrismaClient();

export const cashOutPlayers = async (
	predictionId: string,
	guildId: string,
	decided_outcome: string
) => {
	const totalPool = await prisma.predictionEntries.aggregate({
		_sum: { wageredPoints: true },
		where: { predictionId },
	});
	let totalPoolSum: number;
	if (totalPool._sum.wageredPoints === null) return null; // no bets found

	totalPoolSum = totalPool._sum.wageredPoints;
	console.log(`total pool: ${totalPool}`);

	const victoryPlayers = await prisma.predictionEntries.findMany({
		where: { predicted_outcome: decided_outcome },
	});

	let victoryPool = victoryPlayers.reduce((a, b) => {
		return a + b.wageredPoints;
	}, 0);
	let payout: { userId: string; guildId: string; points: number }[] =
		victoryPlayers.map((p) => {
			let addedPoints = (p.wageredPoints / victoryPool) * totalPoolSum;
			return { userId: p.userId, guildId: p.guildId, points: addedPoints };
		});
	console.log(victoryPlayers);
	console.log(payout);

	const defeatPlayers = await prisma.predictionEntries.findMany({
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
		const User = await prisma.users.findFirst({ where: { guildId, userId } });

		if (User !== null) {
			const {id, points} = User;
            console.log(`updating ${User.userId} in ${User.guildId} to points: ${points + updatePoints}`);
            await prisma.users.update({ where: { id: id }, data: { points: points + updatePoints } });
		}
	}
};

cashOutPlayers("prediction 1", "Fun Guild", "Victory");
