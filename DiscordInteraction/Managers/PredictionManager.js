const EventEmitter = require('events');

const { findGroupUsers, updateUserPoints } = require('../dbInteractions/userDBInteraction');
const emitter = new EventEmitter();

class PredictionStore {
    constructor() {
        this.activePredictions = new Map();
    }

    getPrediction(guildId){
        return this.activePredictions.get(guildId);
    }
    

    addPrediction(guildId, prediction, timeCreated) {

        return new Promise((resolve, reject) => {

            resolve([guildId, prediction, timeCreated]);
        }).then((args) => {
            const [guild, predict, timeCreate] = args;
            const dbGuild = findGroupUsers(guild).then((response) => {
                return new Promise((resolve) => { resolve(response); });
            });
            return Promise.all([dbGuild, predict, timeCreate]);
        }).then((args) => {
            const [guild, predict, timeCreate] = args;
            
            return filterData(guild, predict).then((res) => {
                return new Promise((resolve, reject) => {
                    resolve(res[0]);
                });
            });

        }).then((res) => {
            
            return mapToPredictionMessageContent(res);
        }).then((res) => {
            emitter.emit('validatedBet', res);
        });
    }
}

const predictionStore = new PredictionStore();

async function mapToPredictionMessageContent(validatedMap) {
    let sumDoubt = 0;
    let sumBelieve = 0;
    let largestDoubt = 0;
    let largestBelieve = 0;
    let numBelievers = 0;
    let numDoubters = 0;
    let largestDoubter = "No one doubted";
    let largestBeliever = "No one believed";

    validatedMap.forEach((user, userId) => {
        console.log(user);
        if (user.belief) {
            if (user.wager >= largestBelieve) {
                largestBelieve = user.wager;
                largestBeliever = userId;
                
            }
            numBelievers++;
            sumBelieve += user.wager;
        } else {
            if (user.wager >= largestDoubt) {
                largestDoubt = user.wager;
                largestDoubter = userId;
            }

            numDoubters++;
            sumDoubt += user.wager;
        }
    });

    const amountDescription = [
        {
        name: 'Believe:',
            value: `Points Believe: ${sumBelieve} \n Believers: ${numBelievers}  \n Biggest Believer: <@${largestBeliever}>`,
        inline: true
        },
        {
        name: 'Doubt:',
            value: `Points Doubt: ${sumDoubt} \n Doubters: ${numDoubters}  \n Biggest Doubter: <@${largestDoubter}>`,
        inline: true
        }
    ];
    return amountDescription;
}

async function updateUserData(usersArr) {
    await usersArr.map((user) => {
        const userFilter = { "userId": user.userId, "guildId": user.guildId };
        const userUpdate = { "points": user.points };
        updateUserPoints(userFilter, userUpdate).then(() => { console.log('updated');});
    });
}

async function filterData(dbGuildArr, predictMap) {
    const validatedMap = new Map();
    const filteredDbArr = [];
    predictMap.forEach((value, key) => {
        const foundUser = dbGuildArr.filter((user) => (user.userId === key))[0];
        filteredDbArr.push(foundUser);
    });
    filteredDbArr.map((user) => {
        delete user['_id'];
        delete user['__v'];
        // retrieving the user's wager
        const belief = predictMap.get(user.userId).belief;

        // if zero, do not add to validated wager
        if (user.points === 0) { return; }

        // if they bet too much, they go all in
        if (user.points < predictMap.get(user.userId).wager) {
            validatedMap.set(user.userId, { belief: belief, wager: user.points });
            user.points = 0;
            return;
        } else {
            // otherwise, their points are deducted from their total. Amount verified and added to wager
            user.points -= predictMap.get(user.userId).wager;
            validatedMap.set(user.userId, { belief: belief, wager: predictMap.get(user.userId).wager });
        }
    });

    const dataUpdate = await updateUserData(filteredDbArr);

    return Promise.all([validatedMap, dataUpdate]);
}

emitter.on('predictionSubmit', predictionStore.addPrediction);



module.exports = { emitter };