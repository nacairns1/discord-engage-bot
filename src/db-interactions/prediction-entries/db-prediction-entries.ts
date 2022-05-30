import { PredictionEntries, PrismaClient } from "@prisma/client";
import dayjs from 'dayjs'

const prisma = new PrismaClient();

export const getAllPredictionEntries = async (): Promise<
	PredictionEntries[]
> => {
	const predictionEntries = await prisma.predictionEntries.findMany();
	return predictionEntries;
};

export const getPredictionEntriesByPredictionId = async (
	predictionId: string
): Promise<PredictionEntries[]> => {
	const predictionEntries = await prisma.predictionEntries.findMany({
		where: { predictionId },
	});
	console.log(predictionEntries);
	return predictionEntries;
};

//finds all guild users in a given prediction
export const findGuildUsersInPrediction = async(guildId:string, predictionId: string): Promise<PredictionEntries[]> => {
    const wagerers = await prisma.predictionEntries.findMany({where: {guildId, predictionId}})
    return wagerers;
}

export const findPredictionByPredictionIdUserId = async (
    predictionId: string,
    userId: string
) => {
    const predictionEntry = await prisma.predictionEntries.findFirst({
        where: {predictionId, userId}
    });
    return predictionEntry;
}

export const addPredictionEntryToPredictionId = async (
	predictionId: string,
    userId: string,
	guildId: string,
    predicted_outcome: string,
    wageredPoints: number,
) => {
    const userCheck = await findPredictionByPredictionIdUserId(predictionId, userId);
    if(userCheck !== null) {
        console.log('duplicate prediction entry detected. returning...');
        return;
    }
    const newPredictionEntry = await prisma.predictionEntries.create({data: {
        predictionId,
        userId,
        guildId,
        predicted_outcome,
        wageredPoints,
        earnedPoints: 0,
        timeCreated: dayjs().toISOString(),
    }});

    return newPredictionEntry;
};

