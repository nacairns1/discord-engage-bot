import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, roleMention } from "discord.js";
import { updateDiscordUserManagerRole } from "../../db-interactions/discord/discord-users";
import {
	findUserGuildMembership,
} from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import Command from "./CommandInterface";


const predictionManagerRole: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-manager-role")
		.setDescription("Change manager status of CURRENT users w/ role")
		.addRoleOption((role) =>
			role
				.setName("role")
				.setDescription("DANGER opted-in users will be granted manager")
				.setRequired(true)
		)
		.addBooleanOption((b) =>
			b
				.setDescription("true sets user to manager, false removes")
				.setName("manager")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const user = interaction.user;
		const guildId = interaction.guild?.id;

		const manager = interaction.options.get("manager", true).value;

		if (guildId === undefined || typeof manager !== "boolean") return;

		const userCheck = await findUserGuildMembership(user.id, guildId);
		if (userCheck === null || !userCheck.admin) {
			interaction.followUp({
				content: "You do not have admin privileges.",
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

		const guildMemberUpdateQueue = guildMembers
			.filter((member) => {
				return member.roles.cache.has(role.id);
			})
			.map((member) => {
				let updatePromise = updateDiscordUserManagerRole(member.id, guildId, manager);
				return updatePromise;
			});

		try {
			const updatedUsers = await Promise.all([guildMemberUpdateQueue]);
			const roleSF = roleMention(role.id);
			if (manager) {
				await interaction.followUp({
					content: `${roleSF} has been given Manager privileges!`,
				});
				return;
			} else {
				await interaction.followUp({
					content: `${roleSF} has had Manager privileges removed!`,
				});
				return;
			}
		} catch (e) {
			await interaction.followUp({
				content: "Error when adding role members to Manager privileges",
				ephemeral: true,
			});
			return;
		}
	},
};

export default predictionManagerRole;
