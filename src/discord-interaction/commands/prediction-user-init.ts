import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { addNewDiscordUserInGuild } from "../../db-interactions/discord/discord-users";
import { findUserGuildMembership } from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import { addNewUser } from "../../db-interactions/users/db-users";
import Command from "./CommandInterface";

// manually opting in to the prediction points bot

const predictionUserInit: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-user-init")
		.setDescription("Opts in to earning points"),
	async execute(interaction: CommandInteraction) {
		const user = interaction.user;
		const guildName = interaction.guild?.name;
		if (guildName === undefined || interaction.guild?.id === undefined) return;

		try {
			await interaction.deferReply({ ephemeral: true });
			const userNew = await addNewDiscordUserInGuild(
				user.id,
				interaction.guild?.id,
				500,
				false
			);

			if (userNew === null) {
				await interaction.followUp({content: 'You\'re already a member!', ephemeral: true})
			}
			await interaction.followUp({
				content: `Successfully added ${user.username} to prediction points for server: ${guildName} You've earned 500 points to start!`,
				ephemeral: true,
			});
		} catch (e) {
			await interaction.followUp(`Error when adding your user data. 
			
Has your guild been added yet? A server manager needs to call \`/prediction-server initialize\` first`);
			console.error(e);
		}
	},
};

export default predictionUserInit;
