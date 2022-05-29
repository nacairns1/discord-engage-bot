import { Predictions, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const getAllPredictions = async (): Promise<Predictions[] | null> => {
	const predictions = await prisma.predictions.findMany();
	return predictions;
};

export const findPredictionById = async (predictionId: string) => {
	const prediction = await prisma.predictions.findUnique({
		where: { predictionId },
	});
	return prediction;
};

export const addNewPrediction = async (
	predictionId: string,
	guildId: string,
	creatorId: string,
	outcome_1: string,
	outcome_2: string,
	active: boolean = true,
	decided_outcome: string = "in progress...",
	timeCreated: string = dayjs().toISOString()
) => {
	const predictionSearch = await findPredictionById(predictionId);
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
			decided_outcome,
			timeCreated,
		},
	});
	console.log(newPrediction);
	return newPrediction;
};

export const finishPrediction = async (
	predictionId: string,
	decided_outcome: string
) => {
	const predictionSearch = await findPredictionById(predictionId);
	if (predictionSearch === null || !predictionSearch.active) {
		console.log("Not active prediction found. returning....");
		return;
	}
	const updatePrediction = await prisma.predictions.update({
		where: { predictionId },
		data: { decided_outcome, active: false, timeEnded: dayjs().toISOString() },
	});
    console.log(updatePrediction);
};
