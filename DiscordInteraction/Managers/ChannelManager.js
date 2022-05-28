const { EventEmitter } = require('events');
const channelEmitter = new EventEmitter();

channelEmitter.on('channelSetUp', addHouseChannel);
channelEmitter.on('roleSetUp', setPermittedRole);
// channelEmitter.on('guildSetUp', addPredictionRoleTracker);
class ChannelManager{
    constructor() {
        this.houseChannels = new Map();
        this.rolesMap = new Map();
    }

    setHomeChannel(guildId, channelId) {
        this.houseChannels.set(guildId, channelId);
    }

    setRoleForGuild(guildId, roleId) {
        this.rolesMap.set(guildId, roleId);
    }

    getHomeChannel(guildID) {
        this.houseChannels.get(guildID);
    }

    guildSetUpBoolean(guildId) {
        return this.houseChannels.has(guildId);
    }
}

const channelManager = new ChannelManager();

function addHouseChannel(guildId, channelId) {
    console.log(guildId, channelId);
    console.log('seeing this successfully');
    channelManager.setHomeChannel(guildId, channelId);
}

function setPermittedRole(guildId, roleId) {
    console.log(guildId, roleId);
    channelManager.setRoleForGuild(guildId, roleId);
}



module.exports = { channelEmitter, channelManager };