import { ButtonInteraction, MessageButton } from "discord.js";
import { findUserGuildMembership } from "../../db-interactions/userGuildMemberships/userGuildMemberships";

export const checkPointsMessageButton = new MessageButton()
	.setCustomId("user-check")
	.setLabel("CHECK POINTS!")
	.setStyle("SECONDARY");

export const checkPointsMessageButtonController = async (
	interaction: ButtonInteraction
) => {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    if (guildId ===  null) return;

    try {
        const user = await findUserGuildMembership(userId, guildId);
        if (user === null) throw Error('No user found')
        await interaction.reply({content: `Points: ${user.points}`, ephemeral: true})
    } catch (e) {
        await interaction.reply({content: 'You have not been registered yet!', ephemeral: true});
    }

};
