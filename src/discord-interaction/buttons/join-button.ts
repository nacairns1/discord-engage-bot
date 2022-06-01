import { ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord-api-types/v10";
import { ButtonInteraction, Interaction } from "discord.js";
import { addNewDiscordUserInGuild } from "../../db-interactions/discord/discord-users";

export const joinButton = new ButtonBuilder()
	.setCustomId("user-join")
	.setLabel("START POINTS!")
	.setStyle(ButtonStyle.Primary);

export const joinMessageButton = new ButtonBuilder()
	.setCustomId("user-join")
	.setLabel("START POINTS!")
	.setStyle(ButtonStyle.Primary);
	
export const addUserOnButtonClicked = async (
	interaction: ButtonInteraction
) => {
	const user = interaction.user;
	const guild = interaction.guild;


	if (guild === null) return;
	try {
		const newUser = await addNewDiscordUserInGuild(
			user.id,
			guild.id,
			500,
			false
		);
		if (newUser === null) {
			await interaction.reply({
				content: `You're already registered in ${guild.name}`,
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: `You're registered in server ${guild.name}! You've got ${newUser.points} to start.`,
				ephemeral: true,
			});
		}
	} catch (e) {}
};
