const { DateTime } = require("luxon");
const logger = require("pino")();


const findTotalEntriesOfAPrediction = async (dbClient, predictionId) => {
    const count = await dbClient('PredictionEntries').where({predictionId}).count('predictionId');
    logger.info(count);
    return count;
}

const findEntriesOfAPredictionForOutcome = async(dbClient, predictionId, outcome) => {
    const count = await dbClient('PredictionEntries').where({predictionId, predicted_outcome: outcome}).count(`predicted_outcome as ${outcome}`);
    logger.info(count);
    return count;
}

const findPointsOfAPredictionForOutcome = async(dbClient, predictionId, outcome) => {
    const count = await dbClient('PredictionEntries').where({predictionId, predicted_outcome: outcome}).sum(`wageredPoints`);
    logger.info(count);
    return count;
}


findPointsOfAPredictionForOutcome(dbClient, "prediction1", "believe");