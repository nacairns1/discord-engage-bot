import { Message, MessageReaction, User } from "discord.js";
import { updateDiscordUserPointsOnEngagement } from "../../db-interactions/discord/discord-transactions";
import { findGuild } from "../../db-interactions/guilds/db-guilds";
import { findUser } from "../../db-interactions/users/db-users";
import Event from "./EventInterface";

const messageReactionAdd: Event = {
	name: "messageReactionAdd",
	async execute(interaction: MessageReaction, user: User) {
		if (!interaction.message.guildId || user.bot) return;

		const guildId = interaction.message.guildId;
		const userId = user.id;
 
		if (guildId === null ) return;
		try {
			const isGuildActive = await findGuild(guildId);
			const isUserActive = await findUser(userId);
			if (!(isGuildActive && isUserActive)) return;

            await updateDiscordUserPointsOnEngagement(userId, guildId, 100);
		} catch (e) {
			console.error(e);
			return;
		}
	},
};

export default messageReactionAdd;