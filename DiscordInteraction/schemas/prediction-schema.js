const mongoose = require('mongoose');

const Prediction = new mongoose.Schema(
    {
        guildId: String,
        predictions: [
            {
                userId: String,
                wager: Number,
                prediction: Boolean
            }],
        timeCreated: Number,
        open: Boolean
    });

module.exports = mongoose.model('Prediction', Prediction);