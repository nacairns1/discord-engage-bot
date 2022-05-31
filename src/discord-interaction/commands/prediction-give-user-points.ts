import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { userInfo } from "os";
import { addPointsToDiscordUserInGuild } from "../../db-interactions/discord/discord-users";
import {
	findUserGuildMembership,
	updateUserPoints,
} from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import Command from "./CommandInterface";

// command to give a user points (must be positive value)

const predictionGiveUser: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-give-user")
		.setDescription("Send a user points some points")
		.addUserOption((option) =>
			option
				.setDescription("User to Receive Points")
				.setName("user")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setDescription("Number of Points Between 1 and 1000")
				.setMinValue(1)
				.setMaxValue(5000)
				.setName("points")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply();
		const sendingUser = interaction.user;
		const receivingUser = interaction.options.getUser("User");
		const points = interaction.options.getInteger("Points");

		if (interaction.guildId === null) return;
		if (receivingUser === null) return;
		if (points === null) return;
		// try catch block for finding if the sending user is an admin or has not opted in
		try {
			const isAdmin = await findUserGuildMembership(
				sendingUser.id,
				interaction.guildId
			);
			if (isAdmin === null) {
				await interaction.followUp({
					content:
						"You have not opted in yet! You cannot send points to another user until you do so with /prediction-user-init",
					ephemeral: true,
				});
				return;
			}
			if (isAdmin.admin === false) {
				await interaction.followUp({
					content: "You are not an admin. You cannot send a user points",
					ephemeral: true,
				});
				return;
			}
		} catch (e) {
			await interaction.followUp({
				content:
					"You have not opted in yet! You cannot send points to another user until you do so with /prediction-user-init",
				ephemeral: true,
			});
			return;
		}

		// try catch block for attempting to send the user points
		try {
			const updatedUser = await findUserGuildMembership(
				receivingUser.id,
				interaction.guildId
			);
			if (updatedUser === null) {
				await interaction.followUp({
					content: "The other user has not opted in to earning points yet!",
					ephemeral: true,
				});
				return;
			}

			await interaction.reply(`sending points to <@${receivingUser.id}>...`);
			await addPointsToDiscordUserInGuild(
				sendingUser.id,
				interaction.guildId,
				points
			);
			await interaction.editReply(`success!`);
			await interaction.deleteReply();
			return;
		} catch (e) {
			console.error(e);
		}
	},
};

export default predictionGiveUser;
