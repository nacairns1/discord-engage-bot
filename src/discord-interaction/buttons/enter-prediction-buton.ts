import { ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord-api-types/v10";
import { ButtonInteraction, Interaction, MessageActionRow, MessageButton, Modal } from "discord.js";
import { addNewDiscordPredictionEntry } from "../../db-interactions/discord/discord-transactions";
import { addNewDiscordUserInGuild } from "../../db-interactions/discord/discord-users";
import { findPredictionByPredictionIdUserId } from "../../db-interactions/prediction-entries/db-prediction-entries";
import { findPredictionById } from "../../db-interactions/predictions/db-predictions";
import { predictionEnterMenuFunc } from "../context-menus/prediction-enter-menu";
import { predictionEntryModalGenerator } from "../modals/prediction-enter-modals";

export const enterButton = new ButtonBuilder()
	.setCustomId("user-enter")
	.setLabel("START POINTS!")
	.setStyle(ButtonStyle.Primary);

export const enterMessageButton = (pid: string)=>new MessageButton()
	.setCustomId(`user-enter ${pid}`)
	.setLabel("ENTER!")
	.setStyle("PRIMARY");

export const closedMessageButton = new MessageButton()
	.setCustomId("user-closed")
	.setLabel("CLOSED!")
	.setStyle("DANGER")
	.setDisabled(true);

export const enterUserOnButtonClicked = async (
	interaction: ButtonInteraction
) => {
    await interaction.deferReply({ephemeral: true})
    console.log('seeing interaction');
	const userId = interaction.user.id;
	const guildId = interaction.guildId;
	const pid = interaction.customId.split(' ')[1];
    if (guildId === null) {
		console.log("cannot enter a prediction from outside of a guild");
		return;
	}
    const prediction = await findPredictionById(pid);
    if (prediction === null) return;

    const selectMenuToShow = predictionEnterMenuFunc(pid, prediction.outcome_1, prediction.outcome_2);
    const row = new MessageActionRow().addComponents(selectMenuToShow);

    await interaction.followUp({components:[row], content: `Enter Prediction! pid: ${prediction.predictionId}`, ephemeral: true});
};
