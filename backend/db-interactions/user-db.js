const logger = require("pino")();

const findUserIdInUsers = async (dbClient, userId) => {
	try {
		logger.info(`finding ${userId} table Users`);
		const findUser = await dbClient("Users")
			.where({ userId: userId })
			.select("userId","guildId", "points");
		if (findUser.length === 0) {
			logger.info(`user not found`);
			return false;
		}
		logger.info(`user found`);
		logger.info(findUser);
		return findUser;
	} catch (e) {
		logger.error(e);
	}
};


const findUserIdGuildIdInUsers = async (dbClient, userId, guildId) => {
	try {
		logger.info(`finding ${userId} table Users`);
		const findUser = await dbClient("Users")
			.where({ userId: userId, guildId: guildId })
			.select("userId","guildId", "points");
		if (findUser.length === 0) {
			logger.info(`user not found`);
			return false;
		}
		logger.info(`user found`);
		logger.info(findUser);
		return findUser;
	} catch (e) {
		logger.error(e);
	}
};

const addUserIdToDb = async (dbClient, userId, guildId) => {
	const isUserGuildFound = await findUserIdGuildIdInUsers(
		dbClient,
		userId,
		guildId
	);
	if (isUserGuildFound) {
		logger.info(`user already found. returning without adding a new user`);
		return;
	}
	try {
		logger.info(`adding UserId ${userId} with guild ${guildId} in Users`);
		await dbClient("Users").insert({
			userId: userId,
			guildId: guildId,
			points: 0,
		});
		logger.info(`successful`);
	} catch (e) {
		logger.info(`successful`);
		logger.error(e);
	}
};

const updateUserPointsToDb = async (
	dbClient,
	userId,
	guildId,
	pointsToUpdateTo
) => {
	const userInGuild = await findUserIdGuildIdInUsers(dbClient, userId, guildId);
	if (!userInGuild) {
		logger.info(`${userId} not found with matching ${guildId}`);
		return false;
	}
	try {
		await dbClient("Users")
			.where({ userId, guildId })
			.update({ points: pointsToUpdateTo });
		logger.info(
			`${userId} in ${guildId} updated to points: ${pointsToUpdateTo}`
		);
	} catch (e) {
		logger.error(e);
	}
};

const addUserPointsToUserInGuildId = async (
	dbClient,
	userId,
	guildId,
	pointsToAdd
) => {
	const userInGuild = await findUserIdGuildIdInUsers(dbClient, userId, guildId);
	if (!userInGuild) {
		logger.info(`${userId} not found with matching ${guildId}`);
		return false;
	}
	try {
		const pointsFromDb = await dbClient("Users")
			.where({ userId, guildId })
			.select("points");
		const { points } = pointsFromDb[0];

		await dbClient("Users")
			.where({ userId, guildId })
			.update({ points: points + pointsToAdd });
		logger.info(
			`${userId} in ${guildId} updated to points: ${points} + ${pointsToAdd} = ${
				points + pointsToAdd
			}`
		);
	} catch (e) {
		logger.error(e);
	}
};

module.exports = { findUserIdInUsers, findUserIdGuildIdInUsers, addUserIdToDb, updateUserPointsToDb, addUserPointsToUserInGuildId}