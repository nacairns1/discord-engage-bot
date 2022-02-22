const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');




module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed-test')
        .setDescription('Creates an Embed then counts down the time to zero')
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description')
                .setRequired(false)),
    
    async execute(interaction) {
        let time = 30;
        const author = interaction.member.displayName;
        const channel = interaction.channel.name;
        let description = interaction.options.getString('description');
        if (description == undefined) description = "Believe or Doubt";

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('SUBMIT')
                    .setLabel('SUBMIT')
                    .setStyle('DANGER'));

        const row2 = new MessageActionRow()
            .addComponents(new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Select an option')
                .addOptions(
                    [{ label: "Choose to Believe", value: "Believe", description: "Believe" },
                    { label: "Choose to Doubt", value: "Doubt", description: "Doubt" }])
            );
        

        const exampleEmbed = new MessageEmbed()
            .setTitle(`${author} has begun a prediction in ${channel}`)
            .setDescription(`Starting soon....`)
            .addFields(
                {
                    name: 'Prediction: ',
                    value: description
                },
                {
                    name: 'Join the new prediction',
                    value: 'React here to place 100 points of that number on your bet. Choose which side to bet on then hit submit.'
                });
        
        const wait = require('util').promisify(setTimeout);
        
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
        
        async function embedEditor() {
            time -= 1;
            const newEmbed = new MessageEmbed()
                .setTitle(`${author} has begun a prediction in ${channel}`)
                .setDescription(`Time left: ${time}`)
                .addFields(
                    {
                        name: 'Prediction: ',
                        value: description == '' ? "Believe or Doubt" : description
                    },
                    {
                        name: 'Join the new prediction',
                        value: 'React here to place 100 points of that number on your bet. Choose which side to bet on then hit submit.'
                    });
            await interaction.editReply({ embeds: [newEmbed] });
            if (time === 0) {
                return true;
            } else {
                return false;
            }
        }

        await interaction.reply({ embeds: [exampleEmbed], components: [row, row2] });
        await wait(3000);
        await asyncInterval(embedEditor, 1000, time + 1);
        await wait(1000);
        await interaction.editReply({ content: 'Bet Period over! Believe: Doubt:', embeds: [], components: [] });
    }
};