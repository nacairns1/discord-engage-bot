import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import { CommandInteraction, GuildChannelManager, Message, TextChannel } from "discord.js";
import { client } from "..";
import { addNewDiscordGuild } from "../../db-interactions/discord/discord-guilds";
import Command from "./CommandInterface";

// initializes the guild in the prediction db. Necessary for other functionality.
// if given a channel, sends an initial message with a button to begin tracking as well as gain points.
// these values will be manual right now but can be refactored later and added to the db as default values and thus customizable.

const predictionUserInit: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-init-guild")
		.setDescription("Set up your guild for earning Prediction Points")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("info")
				.setDescription("sends intro information")
				.addChannelOption((channel) =>
					channel
						.addChannelTypes(ChannelType.GuildText)
						.setName("info-channel")
						.setDescription("Channel to send info only visible to you")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("initialize")
				.setDescription("Begins tracking prediction points")
				.addBooleanOption((bool) =>
					bool
						.setName("guild")
						.setDescription("If true, members can begin earning points")
				)
				.addChannelOption((channel) =>
					channel
						.addChannelTypes(ChannelType.GuildText)
						.setName("init-channel")
						.setDescription("Sends public starting info to channel")
						.setRequired(true)
				)
		),
	async execute(interaction: CommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (!interaction.inGuild()) {
            console.log('interaction not in guild. Returning...')
            return null;
        }

        // Subcommand info triggered. Sending ephemeral information into info channel
        if (subcommand === 'info') {
            const channelInfo = interaction.options.getChannel('info-channel');
            if (channelInfo === null) return;
            
            const channelToSend = interaction.client.channels.cache.get(channelInfo.id);
            if(!channelToSend) return;
        }
    },
};

export default predictionUserInit;
