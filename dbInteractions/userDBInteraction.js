const EngagementTracking = require('../schemas/member-schema');

const findUser = async (userId, guildId) => {
    const member = await EngagementTracking.findOne({ userId: `${userId}`, guildId: `${guildId}` }).exec();
    return member;
};

const addUser = async (userId, userName, guildId, guildName, createdTimeStamp, points) => {
    const userPromise = new Promise((res) => { res(findUser(userId, guildId)); });
    return userPromise.then((response) => {
        if (response !== null) {
            return new Promise((res) =>
            { res([response, "duplicate"]); });
        } else {
            const member = {
                userId: `${userId}`,
                userName: `${userName}`,
                guildId: `${guildId}`,
                guildName: `${guildName}`,
                createdTimestamp: `${createdTimeStamp}`,
                points: points
            };
            return EngagementTracking.create(member);
        }
    });
};

module.exports = { findUser, addUser };