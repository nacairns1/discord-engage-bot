import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { CommandInteraction, roleMention } from "discord.js";
import { updateDiscordUserAdminRole } from "../../db-interactions/discord/discord-users";
import {
	findUserGuildMembership,
	updateUserAdminPrivelege,
} from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import Command from "./CommandInterface";

// returns the points for the invoking user

const predictionAddAdminRole: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-change-admin-role")
		.setDescription("Change admin status of CURRENT users w/ role")
		.addRoleOption((role) =>
			role
				.setName("role")
				.setDescription("DANGER opted-in users will be granted admin")
				.setRequired(true)
		)
		.addBooleanOption((b) =>
			b
				.setDescription("true sets user to admin, false removes")
				.setName("admin")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const user = interaction.user;
		const guildId = interaction.guild?.id;

		const admin = interaction.options.get("admin", true).value;

		if (guildId === undefined || typeof admin !== "boolean") return;

		const userCheck = await findUserGuildMembership(user.id, guildId);
		if (userCheck === null || !userCheck.admin) {
			interaction.followUp({
				content: "You do not have admin priveleges.",
				ephemeral: true,
			});
			return;
		}

		const role = interaction.options.get("role", true).role;
		if (role === null || role === undefined) {
			await interaction.followUp({
				ephemeral: true,
				content: "Insufficient role selected.",
			});
			return;
		}
		if (interaction.guild === null) return;

		const guildMembers = await interaction.guild.members.fetch();
		console.log(guildMembers);
		// queue up update role priveleges if user already has opted in.

		const guildMemberUpdateQueue = guildMembers
			.filter((member) => {
				return member.roles.cache.has(role.id);
			})
			.map((member) => {
				let updatePromise = updateDiscordUserAdminRole(member.id, guildId, admin);
				return updatePromise;
			});

		try {
			const updatedUsers = await Promise.all([guildMemberUpdateQueue]);
			const roleSF = roleMention(role.id);
			if (admin) {
				await interaction.followUp({
					content: `${roleSF} has been given admin priveleges!`,
				});
			} else {
				await interaction.followUp({
					content: `${roleSF} has had admin priveleges removed!`,
				});
			}
			return;
		} catch (e) {
			await interaction.followUp({
				content: "Error when adding role members to admin priveleges",
				ephemeral: true,
			});
			return;
		}
	},
};

export default predictionAddAdminRole;
