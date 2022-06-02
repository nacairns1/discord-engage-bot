import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, IntegrationApplication } from "discord.js";
import { findGuildUsersInPrediction } from "../../db-interactions/prediction-entries/db-prediction-entries";
import {
	findUserGuildMembership,
	updateUserAdminPrivilege,
} from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import Command from "./CommandInterface";

// add one specific admin to have the prediction admin privilege. Adds role if role is set for the server.

const predictionAdmin: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-admin")
		.setDescription("Change a user's admin prediction privileges")
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
		const admin = interaction.options.get("admin", true).value;

		if (typeof admin !== "boolean") return null;

		if (guild === null || newUser === undefined) return;

		const oldUserCheck = await findUserGuildMembership(oldUser, guild);
		const newUserCheck = await findUserGuildMembership(newUser, guild);

		if (oldUserCheck === null || !oldUserCheck.admin) {
			await interaction.followUp({
				content: "You do not have admin privileges on this server.",
				ephemeral: true,
			});
			return;
		}
		if (newUserCheck === null) {
			await interaction.followUp({
				content: "The requested user has not signed up.",
				ephemeral: true,
			});
			return;
		} else {
			await updateUserAdminPrivilege(newUser, guild, admin);
			await interaction.followUp({
				content: `<@${newUser}> has Admin status: ${admin}`,
				ephemeral: true,
			});
			return;
		}
	},
};

export default predictionAdmin;
