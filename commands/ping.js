const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageCollector } = require('discord.js');
const { emitter } = require('../Prediction/PredictionManager');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Collects messages for 10 sec'),
    async execute(interaction) {
        
        const prediction = new Map;
        const filter = m => m.content.startsWith('!predict');
        const predictionCol = new MessageCollector(interaction.channel, { filter, time: 10000 });
        predictionCol.on('collect', (message) => {
            const wager = parseInt(message.content.split(' ')[1]);
            const belief = true;
            const author = message.author.id;
            
            prediction.set(author, { belief: belief, wager: wager });
            message.reply({
                content: `${message.author} Bet Received: ${wager} ${belief}`,
                fetchReply: true, repliedUser: true
            }).then((reply) => {
                    return new Promise((res) => {
                        setTimeout(() => {res(reply)}, 3000);
                    });
                }).then((reply) => {
                    reply.delete();
                    message.delete();
                    return new Promise((res) => res('bet received and added'));
                });
        });
        predictionCol.on('end', () => {
            return new Promise((res) => {
                setTimeout(() => { res(emitter.emit('predictionCreate', interaction.guildId, prediction)); }, 3000);
            }).then(() => {
                interaction.followUp("bets received.");
            });
        });

        await interaction.reply('collecting...', { fetchReply: true });
    }
};