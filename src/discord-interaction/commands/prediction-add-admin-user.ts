import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, IntegrationApplication } from "discord.js";
import { findGuildUsersInPrediction } from "../../db-interactions/prediction-entries/db-prediction-entries";
import { findUserGuildMembership, updateUserAdminPrivelege } from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import Command from "./CommandInterface";

// add one specific admin to have the prediction admin privelege. Adds role if role is set for the server.

const predictionUserInit: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-add-admin")
		.setDescription("Grant a user admin prediction priveleges")
		.addUserOption((user) =>
			user.setName("user").setDescription("user to change").setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		const oldUser = interaction.user.id;
		const newUser = interaction.options.getUser("user")?.id;
		const guild = interaction.guildId;
		if (guild === null || newUser === undefined) return;

		const oldUserCheck = await findUserGuildMembership(oldUser, guild);
		const newUserCheck = await findUserGuildMembership(newUser, guild);

		if (oldUserCheck === null || !oldUserCheck.admin) {
			await interaction.user.send("Sorry, you don't have admin priveleges.");
			return;
		}
		if (newUserCheck === null) {
			await interaction.user.send("The requested user has not signed up");
			return;
		}
		if (newUserCheck.admin) {
			await interaction.user.send('The requested user already has admin priveleges');
			return;
		} else {
			await updateUserAdminPrivelege(newUser, guild, true);
			return;
		}

	},
};

export default predictionUserInit;
