const { SlashCommandBuilder } = require('@discordjs/builders');
const GuildConfig = require('../schemas/guild-config-schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-config')
        .setDescription('Choose which role or which channel to track for points')
        .addSubcommand(subcommand =>
            subcommand
                .setName('roles-to-track')
                .setDescription('Set which roles to track')
                .addRoleOption(option => option
                    .setName('role1')
                    .setDescription('Role to track for points')
                    .setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('channels-to-track')
                .setDescription('Choose which channels to track')
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription("Channel to track")
                    .setRequired(true))),
    
    async execute(interaction) {
        await interaction.deferReply();

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

        try {
            await GuildConfig.create(guildConfig)
                .then(interaction.editReply("Guild configurations added."));
        } catch (e) {
            console.error(e);
            await interaction.editReply('Error while adding configuration');
        }
    },
};