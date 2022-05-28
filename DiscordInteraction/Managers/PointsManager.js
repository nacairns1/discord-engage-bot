const { findGroupUsers, updateUserPoints } = require("../dbInteractions/userDBInteraction");
const { guildId } = require('../config.json');
const EventEmitter = require('events');
const pointsEmitter = new EventEmitter();

pointsEmitter.on('startUp', pullPointsOneServer);

class PointsManager{
    constructor() {
        this.guildMap = new Map();
    }
    // guildMaps = Map(guildId, pointsMap)
    // pointsMap = Map(userId, points)

    addPredictionMap(guild, pointsMap) {
        this.guildMap.set(guild, pointsMap);
    }
    getPredictionMap(guild) {
        if (this.guildMap.has(guild)) return this.guildMap.get(guild);

        return "N/A";
    }
    getAllGuilds() {
        return this.guildMap;
    }
    getUserPoints(guild, userId) {
        return getPoints(guild, userId);
    }
}

const pointsManager = new PointsManager(guildId);

async function pullPointsOneServer() {
    const dbData = await findGroupUsers(guildId);
    if (dbData.length == 0) return ("N/A");
    const pointsMap = new Map();
    dbData.map(user => {
        pointsMap.set(user.userId, user.points);
    });
    pointsManager.addPredictionMap(guildId, pointsMap);
    console.log(pointsManager.getPredictionMap(guildId));
    return ("points pulled successfully");
}

async function pushPointsOneServer(_guildId) {

    const _guildMap = pointsManager.get(_guildId);
    _guildMap.forEach((points, user) => {
        const dbFilter = {
            guildId: _guildId,
            userId: user
        };
        const dbUpdate = {
            points: points
        };
        updateUserPoints(dbFilter, dbUpdate);
    });
}

async function pushPointsAllServers() {
    const allGuilds = pointsManager.getAllGuilds();
    allGuilds.forEach((pointsMap, _guildId) => {
        const _guildMap = pointsMap;
        _guildMap.forEach((points, user) => {
            const dbFilter = {
                guildId: _guildId,
                userId: user
            };
            const dbUpdate = {
                points: points
            };
            // updating user points in the database 
            updateUserPoints(dbFilter, dbUpdate);
        });
     });
}

async function addUser(guild, userId, points = 0) {
    if (!pointsManager.guildMap.has(guildId)) return ("Guild not set up.");
    pointsManager.guildMap.get(guildId).set(userId, points);
    return ("user added locally successfully.");
}

async function getPoints(guild, userId) {
    if (!pointsManager.guildMap.has(guildId)) return ("Guild not set up.");
    if (!pointsManager.guildMap.get(guildId).has(userId)) return ("User has not joined points.");
    return pointsManager.guildMap.get(guildId).get(userId);
}






module.exports = { pointsManager, pointsEmitter };