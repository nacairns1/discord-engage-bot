const { DateTime } = require("luxon");
const logger = require("pino")();


const { findGuildIdInGuilds } = require("./guild-db");

const addPredictionId = async (
	dbClient,
	predictionId,
	guildId,
	creatorId,
	outcome_1,
	outcome_2,
	active,
	decided_outcome,
	timeCreated = 0,
	timeEnded = "In Progress..."
) => {
	const isGuildFound = await findGuildIdInGuilds(dbClient, guildId);
	if (!isGuildFound) {
		logger.info(`Guild is not found. Returning without creating a prediction`);
		return;
	}
	if (timeCreated === 0) {
		timeCreated = DateTime.now().toString();
	}
	try {
		const prediction = {
			predictionId,
			guildId,
			creatorId,
			outcome_1,
			outcome_2,
			active,
			decided_outcome,
			timeCreated,
			timeEnded,
		};
		logger.info(`adding:`);
		logger.info(prediction);
		await dbClient("Predictions").insert({
			...prediction,
		});
		logger.info(`successful`);
	} catch (e) {
		logger.info(`unsuccesful`);
		logger.error(e);
	}
};

const findPredictionId = async (dbClient, predictionId) => {
	const isPredictionFound = await dbClient("Predictions")
		.where({ predictionId })
		.select("*");
	if (isPredictionFound.length === 0) {
		logger.info(`no prediction found with ${predictionId}`);
		return false;
	}
	return isPredictionFound[0];
};

const finishPredictionId = async (dbClient, predictionId, decided_outcome = 'cancel') => {
	const timeEnded = DateTime.now().toString();
	const active = false;

	const prediction = await findPredictionId(dbClient, predictionId);
	try {
		const predictionUpdate = await dbClient("Predictions").where({predictionId}).update({active, timeEnded, decided_outcome});
        logger.info(`successfully added predictionUpdate to ${predictionId} at ${timeEnded}`);
	} catch (e) {
        logger.error(e);
    }
};

module.exports = {addPredictionId, findPredictionId, finishPredictionId}