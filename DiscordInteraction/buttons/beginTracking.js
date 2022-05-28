const { addUser } = require('../dbInteractions/userDBInteraction');

module.exports = {
	name: 'beginTracking',
    async execute(interaction) {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered a button interaction.`);
        
        const userId = await interaction.member.id;
        const userName = await interaction.member.displayName;
        const guildId = await interaction.guildId;
        const guildName = await interaction.guild.name;
        const createdTimeStamp = await interaction.createdTimestamp;
        const points = 0;

        await interaction.deferReply({ ephemeral: true });
        
        await addUser(userId, userName, guildId, guildName, createdTimeStamp, points)
            .then((response) => {
                if (response[1]) {
                    return new Promise((res) => {
                        interaction.editReply({ content: `Current Points: ${response[0]["points"]}`, ephemeral: true });
                        res(response[0]);
                    });
                } else {
                    return new Promise((res) => {
                        interaction.editReply({ content: `Now Tracking. Current Points: ${response["points"]}`, ephemeral: true });
                        res(response);
                    });
                }
            });
	},
};