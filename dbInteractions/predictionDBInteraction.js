const Prediction = require('../schemas/prediction-schema');

const addPrediction = async (guild, predict) => {
    const predictArr = [];
    predict.forEach((user, userId) => {
        const newUser = {
            userId: userId,
            wager: user.wager,
            prediction: user.belief
        };
        predictArr.push(newUser);
    });
    console.log(predictArr);
};

// const Prediction = new mongoose.Schema(
//     {
//         guildId: String,
//         predictions: [
//             {
//                 userId: String,
//                 wager: Number,
//                 prediction: Boolean
//             }],
//         timeCreated: Number,
//         open: Boolean
//     });

module.exports = { addPrediction }; 