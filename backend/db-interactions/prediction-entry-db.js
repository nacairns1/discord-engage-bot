const { DateTime } = require("luxon");
const logger = require("pino")();
const { findPredictionId } = require("./prediction-db");

const addPredictionEntry = async (
	dbClient,
	predictionId,
	userId,
	guildId,
	wageredPoints,
	predicted_outcome,
	decided_outcome = "in progress...",
	earnedPoints = 0,
	timeCreated = DateTime.now().toString()
) => {
	const isPredictionFound = await findPredictionId(dbClient, predictionId);
	if (!isPredictionFound) {
		logger.info(
			`Prediction is not found. Returning without creating a prediction entry`
		);
		return;
	}
	try {
		const predictionEntry = {
			predictionId,
			userId,
			guildId,
			predicted_outcome,
			wageredPoints,
			decided_outcome,
			earnedPoints,
			timeCreated,
		};
		logger.info(`adding:`);
		logger.info(predictionEntry);
		await dbClient("PredictionEntries").insert({
			...predictionEntry,
		});
		logger.info(`successful`);
	} catch (e) {
		logger.info(`unsuccesful`);
		logger.error(e);
	}
};

const findPredictionEntry = async (dbClient, predictionId, userId, guildId) => {
	try {
		const entry = await dbClient("PredictionEntries").where({
			predictionId,
			userId,
			guildId,
		});
		if (entry.length === 0) {
			logger.info(
				`could not find prediction entry for ${predictionId} user: ${userId} guild: ${guildId}`
			);
			return false;
		}
		return entry[0];
	} catch (e) {
		logger.error(e);
	}
};

const findUsersInPrediction = async(dbClient, predictionId) => {
    const prediction = await findPredictionId(dbClient, predictionId);
    if (!prediction) {
        logger.info('no prediction found at given id');
        return false;
    }
    const users = await dbClient('PredictionEntries').where({predictionId}).select('predictionId','userId', 'predicted_outcome', 'wageredPoints');
    logger.info(users);
    return users;
}

const updatePredictionEntry = async (
	dbClient,
	predictionId,
	userId,
	guildId,
	wageredPoints,
	predicted_outcome
) => {
	const timeEdited = DateTime.now().toString();
	const entry = await findPredictionEntry(
		dbClient,
		predictionId,
		userId,
		guildId
	);
	if (!entry) {
		logger.info("could not find prediction entry");
		return;
	}
	try {
		const updatedEntry = await dbClient("PredictionEntries")
			.where({ predictionId, userId, guildId })
			.update({ predicted_outcome, wageredPoints, timeEdited });
		logger.info(`succesfully updated entry for ${predictionId} ${userId}`);
		return updatedEntry;
	} catch (e) {
		logger.error(e);
	}
};

const finishPredictionEntry = async (
	dbClient,
	predictionId,
	userId,
	guildId,
	earnedPoints,
	decided_outcome
) => {
	const entry = await findPredictionEntry(
		dbClient,
		predictionId,
		userId,
		guildId
	);
	if (!entry) {
		logger.info("could not find prediction entry");
		return;
	}
	try {
		const updatedEntry = await dbClient("PredictionEntries")
			.where({ predictionId, userId, guildId })
			.update({ decided_outcome, earnedPoints });
		logger.info(
			`succesfully finished prediction entry for ${predictionId} ${userId}`
		);
		return updatedEntry;
	} catch (e) {
		logger.error(e);
	}
};

module.exports = {addPredictionEntry, findPredictionEntry, updatePredictionEntry, finishPredictionEntry, findUsersInPrediction}