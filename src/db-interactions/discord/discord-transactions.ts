import {
	PredictionEntries,
	PrismaClient,
	PrismaPromise,
	UserGuildMemberships,
	Users,
} from "@prisma/client";
import dayjs from "dayjs";

import { finishPrediction } from "../predictions/db-predictions";
import { findGuildUsersInPrediction } from "../prediction-entries/db-prediction-entries";

// change this section from a REST Api to an api for our discord bot to talk back and forth on the same application.
// No need to create a whole separate web server yet
const prisma = new PrismaClient();

export const cashOutPlayers = async (
	predictionId: string,
	decided_outcome: string
) => {
	const prediction = await prisma.predictions.findUnique({
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
	let allPlayers = await prisma.predictionEntries.findMany({
		where: { predictionId },
	});

	let totalSum: number = 0;
	let winnerSum: number = 0;
	let topWinner: PredictionEntries | undefined;
	allPlayers.map((player) => {
		totalSum += player.wageredPoints;
		if (player.predicted_outcome === decided_outcome) {
			if (
				topWinner === undefined ||
				topWinner.wageredPoints < player.wageredPoints
			) {
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
		data: { timeEnded: dayjs().toISOString(), decided_outcome, active: false },
	});

	//queue the prediction entries update
	let allPredictionEntriesUpdateQueue: PrismaPromise<PredictionEntries>[] =
		allPlayers.map((player) => {
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
	let allUsersGuildMembershipsUpdateQueue: PrismaPromise<UserGuildMemberships>[] =
		allPlayers
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
		await prisma.$transaction([
			predictionUpdate,
			...allPredictionEntriesUpdateQueue,
			...allUsersGuildMembershipsUpdateQueue,
		]);
		console.log(
			"successfully updated gm's, prediction, and prediction entries"
		);
		return { totalSum, winnerSum, topWinner };
	} catch (e) {
		console.error("error cashing out players");
		console.error(e);
		return null;
	}
};

export const addNewDiscordPredictionEntry = async (
	predictionId: string,
	userId: string,
	guildId: string,
	wageredPoints: number,
	predicted_outcome: string
) => {
	const foundUGM = await prisma.userGuildMemberships.findUnique({
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
				timeCreated: dayjs().toISOString(),
				earnedPoints: 0,
			},
		});
		console.log("attempting user update and prediction entry creation...");
		await prisma.$transaction([updatedUGM, newPredictionEntry]);
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
			timeCreated: dayjs().toISOString(),
			earnedPoints: 0,
		},
	});
	await prisma.$transaction([updatedUGM, newPredictionEntry]);
	return { predictionId, userId, guildId, wageredPoints, predicted_outcome };
};

export const updateDiscordPredictionEntry = async (
	predictionId: string,
	userId: string,
	guildId: string,
	wageredPoints: number,
	predicted_outcome: string
) => {
	const foundPredictionEntry = await prisma.predictionEntries.findUnique({
		where: { predictionId_userId_guildId: { predictionId, userId, guildId } },
	});
	if (foundPredictionEntry === null) {
		console.error("no user found to update");
		return null;
	}
	const ugm = await prisma.userGuildMemberships.findUnique({
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
			await prisma.$transaction([updatedUgm, updatedPe]);
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
		console.log(
			"attempting updated wager with points remaining (same side)..."
		);
		await prisma.$transaction([updatedUgm, updatedPe]);
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
			await prisma.$transaction([updatedUgm, updatedPE]);
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
		await prisma.$transaction([updatedUgm, updatedPE]);
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

		await prisma.$transaction([updatedPE]);
		return { predicted_outcome, points: wageredPoints };
	} else {
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

		await prisma.$transaction([updatedUgm, updatedPE]);
		return { predicted_outcome, points: wageredPoints };
	}
};

export const updateDiscordUserPointsOnEngagement = async (
	userId: string,
	guildId: string,
	pointsToAdd: number
) => {
	const now = dayjs();
	const ugm = await prisma.userGuildMemberships.findUnique({
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
		const updatedUGM = await prisma.userGuildMemberships.update({
			where: { userId_guildId: { userId, guildId } },
			data: { points: { increment: pointsToAdd }, lastEarnedPonts: now.toISOString() },
		});
		return updatedUGM;
	}
	// case where its too soon
	return null;
};
