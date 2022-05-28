const logger = require("pino")();

const findGuildIdInGuilds = async (dbClient, guildId) => {
	try {
		const guild = await dbClient("Guilds").select("*").where({ guildId });
		console.log(guild);
		if (guild.length === 0) {
			logger.info(`${guildId} not found in Guilds`);
			return false;
		}
		logger.info(`${guildId} correctly found in Guilds`);
		return guild;
	} catch (e) {
		logger.error(e);
	}
};

const addGuildIdToDb = async (dbClient, guildId) => {
	const guildInDb = await (findGuildIdInGuilds(dbClient, guildId));
	if(guildInDb) {
		logger.info(`${guildId} already found. Returning without creating a duplicate`);
		return false;
	}

	try {
		await dbClient("Guilds").insert({ guildId: guildId });
		logger.info(`Successfully added ${guildId} to Guilds`);
		const guild = await dbClient("Guilds").select("*");
		return guild;
	} catch (e) {
		logger.error(e);
	}
};

module.exports = {findGuildIdInGuilds, addGuildIdToDb}