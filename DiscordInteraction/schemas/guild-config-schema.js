const mongoose = require('mongoose');

const GuildConfig = new mongoose.Schema(
    {
        guildId: String,
        guildName: String,
        guildConfigCreated: String,
        guildPermittedRoles: Object,
        guildPermittedChannels: String,
        guildPermittedTrackingEvents: Object
    });

module.exports = mongoose.model('GuildConfig', GuildConfig);