import { VoiceState } from "discord.js";
import Event from "./EventInterface";
import { client } from "../index";
import { updateDiscordUserPointsOnEngagement } from "../../db-interactions/discord/discord-transactions";

const checkVoiceState = async (
	userId: string,
	guildId: string,
	pointsToAdd: number
) => {
	try {
		const updatePoints = await updateDiscordUserPointsOnEngagement(
			userId,
			guildId,
			pointsToAdd
		);
		if (updatePoints !== null) console.log(`activity points created for ${userId} in ${guildId} for a voice channel event!`);
		return updatePoints;
	} catch (e) {
		console.error(e);
		return null;
	}
};

const voiceStateUpdate: Event = {
	name: "voiceStateUpdate",
	async execute(oldVoiceState: VoiceState, newVoiceState: VoiceState) {
		const newUserId = newVoiceState.id;
		const guildId = newVoiceState.guild.id;

		// streaming support not implemented but referenced here for future implementation
		const { serverDeaf, selfDeaf, streaming, channelId } = newVoiceState;

		// new voice state is the member leaving the server or deafening
		// end the active interval for the user
		if (
			serverDeaf ||
			selfDeaf ||
			serverDeaf === null ||
			selfDeaf === null ||
			channelId === null
		) {
			const intervalToEnd = client.intervals?.get(newUserId);
			if (intervalToEnd) {
				clearInterval(intervalToEnd);
				console.log(`voice activity points ended for ${newUserId} in ${guildId}!`);
				client.intervals?.delete(newUserId);
			}
			return;
		} else {
			
			// new voice state is the member joining or changing a voice channel.
			//  Initialize the interval for the user if they are not just changing the channel

			if (client.intervals?.get(newUserId)) return;
			const timer = setInterval(async () => {
				await checkVoiceState(newUserId, guildId, 100);
			}, 900000);


			client.intervals?.set(newUserId, timer);
			return;
		}
	},
};

export default voiceStateUpdate;
