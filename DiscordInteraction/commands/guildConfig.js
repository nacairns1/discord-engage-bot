const { SlashCommandBuilder } = require('@discordjs/builders');
const GuildConfig = require('../schemas/guild-config-schema');
const { guildEmitter } = require('../Managers/ChannelManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-config')
        .setDescription('Choose which role or which channel to track for points')
        .addSubcommand(subcommand => 
            subcommand
                .setName('channel-home')
                .setDescription('Choose which channel house the predictions')
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription("Channel to House the bot. This is where the bot can post.")
                    .setRequired(true))),
    
    async execute(interaction) {
        await interaction.deferReply();
        const channel = interaction.options.getChannel('channel').id;
        //  implement checking to see if member has at least mod level in server
        const role = interaction.options.getRole('role1');
        const guildId = await interaction.guildId;
        const guildName = await interaction.guild.name;
        const createdTimeStamp = await interaction.createdAt;
        const roles = [role];

        // implement checking to see if a config for the server already exists. If so, replace it.

        const guildConfig = {
            guildId: `${guildId}`,
            guildName: `${guildName}`,
            createdTimestamp: `${createdTimeStamp}`,
            roles: roles
        };

        guildEmitter.emit('guildHouseChannel', guildId, channel);
        // try {
        //     await GuildConfig.create(guildConfig)
        //         .then(interaction.editReply("Guild configurations added."));
        // } catch (e) {
        //     console.error(e);
        //     await interaction.editReply('Error while adding configuration');
        // }
    },
};