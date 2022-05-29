const knex = require("knex");
const path = require("path");
const pathToDb = path.resolve("./database/test_database.sqlite");

const {
	addPredictionEntry,
	findPredictionEntry,
	updatePredictionEntry,
	finishPredictionEntry,
	findUsersInPrediction,
} = require("../db-interactions/prediction-entry-db");

const dbClient = knex({
	client: "sqlite3",
	connection: {
		filename: pathToDb,
	},
	useNullAsDefault: true,
});

const addPredictionEntryByUserId = async (req, res, next) => {
	
}