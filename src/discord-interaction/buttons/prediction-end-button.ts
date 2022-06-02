import { ButtonStyle } from "discord-api-types/v10";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	Interaction,
	MessageActionRowComponentBuilder,
} from "discord.js";
import { addNewDiscordPredictionEntry } from "../../db-interactions/discord/discord-transactions";
import { addNewDiscordUserInGuild } from "../../db-interactions/discord/discord-users";
import { findPredictionByPredictionIdUserId } from "../../db-interactions/prediction-entries/db-prediction-entries";
import { findPredictionById } from "../../db-interactions/predictions/db-predictions";
import { findUserGuildMembership } from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import { predictionEndMenuFunc } from "../context-menus/prediction-end-menu";
import { predictionEnterMenuFunc } from "../context-menus/prediction-enter-menu";
import { predictionEntryModalGenerator } from "../modals/prediction-enter-modals";


export const endPredictionButton = new ButtonBuilder()
		.setCustomId(`user-end`)
		.setLabel("END PREDICTION!")
		.setStyle(ButtonStyle.Primary);

export const predictionEndOnButtonClicked = async (
	interaction: ButtonInteraction
) => {
    await interaction.deferReply({ ephemeral: true });
try {
			const userId = interaction.user.id;
			const guildId = interaction.guildId;
			if (guildId === null) {
				await interaction.followUp("Must use this command inside of a server");
				return;
			}
			const ugm = await findUserGuildMembership(userId, guildId);
			if (ugm === null) {
				await interaction.followUp({
					content: "You were not found to be a registered member",
					ephemeral: true,
				});
				return;
			}
			if (!ugm.admin) {
				await interaction.followUp({
					content: "You do not have admin priveleges on this server",
					ephemeral: true,
				});
                return;
			}

            const rawContent = interaction.message.content;
            const splitContent = rawContent.split(' ');
            const predictionId = splitContent[splitContent.length - 1 ];
            

			if (typeof predictionId !== 'string') {
				interaction.followUp({
					content: "No prediction found with the given ID",
					ephemeral: true,
				});
				return;
			}

			const p = await findPredictionById(predictionId);
			if (p === null) throw Error("no prediction found");
			

			const { outcome_1, outcome_2 } = p;
			
			const selectMenu:MessageActionRowComponentBuilder = predictionEndMenuFunc(outcome_1, outcome_2);

			const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			[selectMenu]
			);

			await interaction.followUp({
				content: `End the prediction here for pid: ${predictionId}`,
				components: [actionRow],
				ephemeral: true,
			});
		} catch (e) {
			await interaction.followUp({content: "error ending predictions", ephemeral: true})
			console.error(e);
		}



};
