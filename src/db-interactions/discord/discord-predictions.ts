import { addNewPrediction, updatePredictionToClosed } from "../predictions/db-predictions";
import { cashOutPlayers } from "./discord-transactions";

export const addNewPredictionInGuildByCreator = async (
	discordPredictionId: string,
	guildId: string,
	creatorId: string,
	outcome_1: string,
	outcome_2: string
) => {
	try {
		const newPrediction = await addNewPrediction(
			discordPredictionId,
			guildId,
			creatorId,
			outcome_1,
			outcome_2
		);
		console.log(
			`New Prediction ${discordPredictionId} created by ${creatorId} in ${guildId}`
		);
		return newPrediction;
	} catch (e) {
		console.error(e);
		return null;
	}
};

// returns the total pool entered, the amount of points the winners entered, and the highest winner
export const finishPredictionAndRedeemWinners = async (
	predictionId: string,
	decided_outcome: string
) => {
	try {
		const finishedPrediction = cashOutPlayers(predictionId, decided_outcome);
        console.log(`finished prediction and redeemed player points.`);
        return finishedPrediction;
	} catch (e) {
		console.error(e);
		return null;
	}
};

export const closePredictionToNewEntries = async (
	predictionId: string
) => {
	try {
		const predictionToClose = await updatePredictionToClosed(predictionId);
		return predictionToClose;
	} catch(e) {
		console.error(e);
		return null;
	}
}


