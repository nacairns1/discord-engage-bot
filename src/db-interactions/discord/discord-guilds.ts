import { addNewGuild } from "../guilds/db-guilds";

// returns null if rejected to add a new guild.
export const addNewDiscordGuild = async (discordGuildId: string) => {
	try {
		const newGuild = await addNewGuild(discordGuildId);
        if (newGuild === null) throw Error('error creating new guild');
		console.log(`added ${newGuild.guildId}`);
		return newGuild;
	} catch (e) {
		console.error(e);
		return null;
	}
}
