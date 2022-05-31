import { Guild, Interaction, Message, Snowflake, VoiceState } from "discord.js";
import Event from "./EventInterface";
import { findGuild } from "../../db-interactions/guilds/db-guilds";
import { findUser } from "../../db-interactions/users/db-users";
import { updateDiscordUserPointsOnEngagement } from "../../db-interactions/discord/discord-transactions";

const messageCreate: Event = {
	name: "messageCreate",
	async execute(interaction: Message) {
		if (interaction.author.bot) return;

		const guildId = interaction.guildId;
		const userId = interaction.author.id;

		if (guildId === null) return;
		try {
			const isGuildActive = await findGuild(guildId);
			const isUserActive = await findUser(userId);
			if (!(isGuildActive && isUserActive)) return;

            await updateDiscordUserPointsOnEngagement(userId, guildId, 1000);
		} catch (e) {
			console.error(e);
			return;
		}
	},
};

export default messageCreate;
