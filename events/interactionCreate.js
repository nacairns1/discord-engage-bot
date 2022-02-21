/* eslint-disable brace-style */
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

        if (!interaction.isCommand()) return;
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered a slash command interaction.`);
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            // console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered command: ${interaction.commandName}.`);
            command.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
	},
};
