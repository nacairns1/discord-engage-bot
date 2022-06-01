import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, IntegrationApplication } from "discord.js";
import { findGuildUsersInPrediction } from "../../db-interactions/prediction-entries/db-prediction-entries";
import {
	findUserGuildMembership,
	updateUserAdminPrivelege,
} from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import Command from "./CommandInterface";

// add one specific admin to have the prediction admin privelege. Adds role if role is set for the server.

const predictionUserInit: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-change-admin")
		.setDescription("Change a user's admin prediction priveleges")
		.addUserOption((user) =>
			user.setName("user").setDescription("user to change").setRequired(true)
		)
		.addBooleanOption((b) =>
			b
				.setDescription("true sets user to admin, false removes")
				.setName("admin")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const oldUser = interaction.user.id;
		const newUser = interaction.options.getUser("user")?.id;
		const guild = interaction.guildId;
		const admin = interaction.options.get('admin', true).value;

		if (typeof admin !== 'boolean') return null;

		if (guild === null || newUser === undefined) return;

		const oldUserCheck = await findUserGuildMembership(oldUser, guild);
		const newUserCheck = await findUserGuildMembership(newUser, guild);

		if (oldUserCheck === null || !oldUserCheck.admin) {
			await interaction.followUp({
				content: "Sorry, you don't have admin priveleges.",
				ephemeral: true,
			});
			return;
		}
		if (newUserCheck === null) {
			await interaction.followUp({
				content: "The requested user has not signed up",
				ephemeral: true,
			});
			return;
		}
		if (newUserCheck.admin && admin === true) {
			await interaction.followUp({
				ephemeral: true,
				content: "The requested user already has admin priveleges",
			});
			return;
		} else {
			await updateUserAdminPrivelege(newUser, guild, admin);
			await interaction.followUp({
				content: `<@${newUser}> has Admin status: ${admin}`,
				ephemeral: true,
			});
			return;
		}
	},
};

export default predictionUserInit;
