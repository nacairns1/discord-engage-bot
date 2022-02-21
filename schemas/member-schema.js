const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    userID: mongoose.SchemaTypes.String,
    userName: mongoose.SchemaTypes.String,
    guildID: mongoose.SchemaTypes.String,
    guildName: mongoose.SchemaTypes.String,
    roles: mongoose.SchemaTypes.String,
    points: Number
});

module.exports = mongoose.model('EngagementTracking', MemberSchema);