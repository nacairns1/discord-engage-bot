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
        isActive: Boolean,
        timeCreated: Number
    });

module.exports = mongoose.model('Prediction', Prediction);