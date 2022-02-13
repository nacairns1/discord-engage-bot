const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give-role')
        .setDescription('Give a chosen user a chosen role')
        .addUserOption(option => option.setName('user').setDescription('The User')
            .setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role to add')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const user = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');
        try {
            if (user.roles.cache.has(role.id)) {
                interaction.editReply('Cannot add role again');
                return;
            }
            user.roles.add(role);
            await interaction.editReply(`${user.name} received ${role} successfully`);
        } catch (e) {
            console.error(e);
            await interaction.editReply('Error while adding role');
        }
    },
};