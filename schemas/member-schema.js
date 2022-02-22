const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    userId: mongoose.SchemaTypes.String,
    userName: mongoose.SchemaTypes.String,
    guildId: mongoose.SchemaTypes.String,
    guildName: mongoose.SchemaTypes.String,
    roles: mongoose.SchemaTypes.String,
    points: Number,
    createdTimestamp: Number
});

module.exports = mongoose.model('EngagementTracking', MemberSchema);