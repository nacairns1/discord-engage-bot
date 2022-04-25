const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageCollector, MessageEmbed } = require('discord.js');
const { emitter } = require('../Managers/PredictionManager');

// async interval
const asyncInterval = async (callback, ms, triesLeft = 5) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            if (await callback()) {
                resolve();
                clearInterval(interval);
            } else if (triesLeft <= 1) {
                reject();
                clearInterval(interval);
            }
            triesLeft--;
        }, ms);
    });
};

function parseBelieveOrDoubt(message) {
    const belRe = /bel/i;
    const douRe = /dou/i; 
    if (douRe.test(message)) return false;
    if (belRe.test(message)) return true;
    return "N/A";
}

function garbageCollectorFilter(message) {
    const predRe = /^[!]predict/;
    return !predRe.test(message);
}

// promisify wait
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prediction-create')
        .setDescription('Creates a Prediction with a Description Open For a Period of Time')
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Describe the prediction')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName("time")
                .setDescription("Number of seconds for prediction to be open. Max 180, Min 15.")
                .setMaxValue(180)
                .setMinValue(15)
                .setRequired(false)
        ),
    async execute(interaction) {
        // variable declaration
        const betAuthor = interaction.member.displayName;
        const channel = interaction.channel.name;
        let description = interaction.options.getString('description');
        let time = interaction.options.getInteger('time');
        if (time == undefined) time = 60;
        if (description == undefined) description = "Believe or Doubt";
        const timeInMs = time * 1000;
        // functionality to collect bets 
        const prediction = new Map;
        const filter = m => (/^[!]predict/i).test(m.content);
        const predictionCol = new MessageCollector(interaction.channel, { filter, time: timeInMs });

        const timeCreated = interaction.createdAt;


        // event based collector collects and parses messages coming in after the event starts.
        predictionCol.on('collect', (message) => {
            if (message.author.bot) return;
            const wager = parseInt(message.content.split(' ')[1]);
            const belief = true;
            const author = message.author.id;
            console.log(belief, wager);

            const tempBelief = belief ? "Believe" : "Doubt";
            // functionality of fetching and deleting messages after 3 seconds
            prediction.set(author, { belief: belief, wager: wager });
            message.reply({
                content: `${message.author} Bet Received: ${wager} ${tempBelief}. Points are validated once prediction closes.`,
                fetchReply: true, repliedUser: true
            }).then((reply) => {
                return new Promise((res) => {
                    setTimeout(() => { res(reply); }, 5000);
                });
            }).then((reply) => {
                reply.delete();
                message.delete();
                return new Promise((res) => res('Bet received and added'));
            });
        });

        // on the end of the collection length, emits an event to parse the data to 1) store the data in the db
        // 2) return the data in a message embed field format

        await interaction.reply('Prediction starting soon...', { fetchReply: true });
        await wait(2000);
        await asyncInterval(embedEditor, 1000, time + 2);

        // timer function for embed
        async function embedEditor() {
            time -= 1;
            const newEmbed = new MessageEmbed()
                .setTitle(`${betAuthor} has begun a prediction in ${channel}`)
                .setDescription(`Time left: ${time}`)
                .addFields(
                    {
                        name: 'Prediction: ',
                        value: description
                    },
                    {
                        name: 'Join the new prediction',
                        value: '\nJoin by typing !Predict [Points] [Believe/Doubt] \n\n Example: !Predict 500 Believe \n\n Start tracking your points and get an initial 500 by reacting to this message'
                    });

            await interaction.editReply({ embeds: [newEmbed] });
            if (time === 0) {
                // emits out the prediction map, the guildId, and the time created 
                console.log(prediction);
                emitter.emit('predictionSubmit', interaction.guildId, prediction, timeCreated);
                return true;
            } else {
                return false;
            }
        }


        // The prediction manager then emits back the message in embed form with user snowflakes and bet information.
        emitter.on('validatedBet', displayValidatedBet);
        
        async function displayValidatedBet(validatedBet) {
            const predictionLockedInEmbed = new MessageEmbed()
                .setTitle(`Prediction Locked In!`)
                .setDescription(`${description}`)
                .addFields(validatedBet[0], validatedBet[1]);
            await console.log(validatedBet);
            await interaction.editReply({
                content: 'Prediction Ongoing...', embeds: [predictionLockedInEmbed],
                fetchReply: true
            });
        }



    }
};