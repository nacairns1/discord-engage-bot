const EventEmitter = require('events');
const Prediction = require('../schemas/prediction-schema');

const emitter = new EventEmitter();

class PredictionStore {
    constructor() {
        this.predictions = new Map();
    }
    getPrediction(guildId) {
        return this.predictions.get(guildId);
    }

    addPrediction(guildId, prediction, timeCreated) {
        return new Promise((res) => {
            const predictArr = [];
            prediction.forEach((value, key) => {
                const userObj = { userId: key, wager: value.wager, belief: value.belief };
                predictArr.push(userObj);
            });
            const predictToAdd = {
                guildId: guildId,
                predictions: predictArr
            };
            res(predictToAdd);
        }).then((predictToAdd) => {
            return new Promise((resolve, reject) => {
                //validate here?
                Prediction.create(predictToAdd);
                resolve(predictToAdd);
            });
        });
    }
}


const predictionStore = new PredictionStore();

emitter.on('predictionCreate', predictionStore.addPrediction);



module.exports = { emitter, predictionStore };