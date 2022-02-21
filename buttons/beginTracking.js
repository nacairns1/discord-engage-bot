const MemberTrack = require('../schemas/member-schema');

module.exports = {
	name: 'beginTracking',
    async execute(interaction) {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered a button interaction.`);
        const author = await interaction.member.id;
        const authorName = await interaction.member.displayName;
        const guildId = await interaction.guildId;
        const guildName = await interaction.guild.name;
        const createdTimeStamp = await interaction.createdAt;
        const points = 0;
        let userFound = false;
        await interaction.deferReply({ ephemeral: true });

        const member = {
            userID: `${author}`,
            userName: `${authorName}`,
            guildID: `${guildId}`,
            guildName: `${guildName}`,
            createdTimestamp: `${createdTimeStamp}`,
            points: points
        };

        let activeUserPoints = 0;
        MemberTrack.findOne({ userID: `${author}`, guildID: `${guildId}` }).exec()
            .then((response) => {
                activeUserPoints = response["points"];
            });
        
        
        await MemberTrack.findOne({ userID: `${author}`, guildID: `${guildId}` }).exec().then((res) => {
            console.log(res);
            if (res != null) {
                console.log('active member already');
                interaction.editReply({ content: "Your current points are: " + activeUserPoints, ephemeral: true });
                userFound = true;
                return true;
            }
        });
        
        

        try {
            new Promise((resolve, reject) => {
                if (userFound) return;
                MemberTrack.create(member);
                
                resolve(console.log('initiated schema request'));
            }, () => {
                console.log("user is already active");
                interaction.editReply({ content: "Your current points are: ", ephemeral: true });
                console.log('new Member not created for Username: ' + authorName);
            }).then((response) => {
                interaction.editReply({
                    content: "Your engagement is now being tracked. Earn points by being in voice calls, reacting to messages, and posting messages", ephemeral: true });
                console.log('new Member created successfully. Username: ' + author);
                console.log(`repsonse: ${response}`);
            });
            
        } catch (e) {
            console.log(`error creating member ${e}`);
        }

	},
};