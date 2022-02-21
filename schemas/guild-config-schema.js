const mongoose = require('mongoose');

const GuildConfig = new mongoose.Schema(
    {
        guildId: String,
        guildName: String,
        guildConfigCreated: String,
        guildPermittedRoles: [{ type: String }],
        guildPermittedChannels: String,
        guildPermittedTrackingEvents: [{ type: String }]
    });

module.exports = mongoose.model('GuildConfig', GuildConfig);