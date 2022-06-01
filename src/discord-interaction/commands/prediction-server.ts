import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import {
	CommandInteraction,
	MessageOptions,
} from "discord.js";
import { client } from "..";
import { addNewDiscordGuild } from "../../db-interactions/discord/discord-guilds";
import { addNewDiscordUserInGuild } from "../../db-interactions/discord/discord-users";
import { updateUserAdminPrivelege } from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import {
	joinRowInMessage,
} from "../action-rows/join-action-row";
import { helpEmbed } from "../embeds/help-embed";
import Command from "./CommandInterface";

// initializes the guild in the prediction db. Necessary for other functionality.
// if given a channel, sends an initial message with a button to begin tracking as well as gain points.
// these values will be manual right now but can be refactored later and added to the db as default values and thus customizable.

const predictionServer: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-server")
		.setDescription("Set up bot")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("initialize")
				.setDescription("Begins points watching")
				.addChannelOption((channel) =>
					channel
						.addChannelTypes(ChannelType.GuildText)
						.setName("init-channel")
						.setDescription("Sends public starting info")
						.setRequired(true)
				)
		),
	async execute(interaction: CommandInteraction) {
		const initChannel = interaction.options.getChannel("init-channel");

		if (interaction.guild?.id === null || interaction.guild?.id === undefined)
			return;

		await interaction.reply({ content: "adding server....", fetchReply: true });
		const addNewGuild = await addNewDiscordGuild(interaction.guild.id);
		await interaction.deleteReply();

		if (initChannel !== null) {
			const initialContent: MessageOptions = {
				content: `Welcome to Predictions Points! `,
				embeds: [helpEmbed],
				components: [joinRowInMessage],
			};
			const initChannelid = initChannel.id;
			const owner = await interaction.guild.fetchOwner();
			if (interaction.guildId === null) return;
			if (await addNewDiscordUserInGuild(owner.id, interaction.guildId, 500, true) === null) {
				console.log('existing user detected. upgrading to admin...');
				await updateUserAdminPrivelege(owner.id, interaction.guildId, true);
			};

			const channel = interaction.client.channels.cache.get(initChannelid);
			if (channel?.type === "GUILD_TEXT") {
				channel.send(initialContent);
			}
		}
	},
};

export default predictionServer;
