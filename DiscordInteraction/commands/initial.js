const { SlashCommandBuilder } = require('@discordjs/builders');
const { channelEmitter, channelManager } = require('../Managers/ChannelManager');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prediction-initial')
        .setDescription('Set up the bot'),
    async execute(interaction) {
        
        if (channelManager.guildSetUpBoolean(interaction.guildId)) {
            const reply = await interaction.reply('Guild already set-up.', { fetchReply: true });
            await wait(2000);
            reply.delete();
        }

        const newChannel = await interaction.guild.channels.create('Prediction Channel', {
            type: 'GUILD_TEXT',
            reason: 'bot home'
        });
        const newChannelId = await newChannel.id;
        await newChannel.send('Housed here');
        const newRole = await interaction.guild.roles.create({
            name: 'Prediction Enjoyers',
            color: 'DARK_VIVID_PINK',
            reason: 'Whitelist role for tracking points'
        });

        const newRoleId = await newRole.id;

        channelEmitter.emit('roleSetUp', interaction.guildId, newRoleId);
        channelEmitter.emit('guildSetUp', interaction.guildId, newChannelId);

        const dmChannel = await interaction.member.createDM();
        const dmChannelInst = await dmChannel.fetch();
        dmChannelInst.send(`Setup complete in ${interaction.guild.name}`);
        await interaction.reply(`Bot set up! \n Role ${newRole} added.\n Use the role to track points`,
            { fetchReply: true });
         
    }
};