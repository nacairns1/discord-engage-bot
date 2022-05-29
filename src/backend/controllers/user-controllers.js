const knex = require("knex");
const path = require("path");
const pathToDb = path.resolve("./database/test_database.sqlite");

const {addUserIdToDb, findUserIdInUsers, findUserIdGuildIdInUsers} = require('../db-interactions/user-db');


const dbClient = knex({
	client: "sqlite3",
	connection: {
		filename: pathToDb,
	},
	useNullAsDefault: true,
});

const getUserByUserId = async (req, res, next) => {
    const {userId} = req.body;
    const foundUser = await findUserIdInUsers(dbClient, userId);
    return res.json({foundUser});
};

const getUserByUserIdGuildId = async (req, res, next) => {
    const {userId, guildId} = req.body;
    const foundUser = await findUserIdGuildIdInUsers(dbClient, userId, guildId);
    return res.json({foundUser});
};

const addNewUserInGuildId = () => {};

module.exports = {getUserByUserId, addNewUserInGuildId, getUserByUserIdGuildId};