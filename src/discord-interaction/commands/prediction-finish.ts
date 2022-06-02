import { ActionRowBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
	CommandInteraction,
	MessageActionRowComponentBuilder,
} from "discord.js";
import { cashOutPlayers } from "../../db-interactions/discord/discord-transactions";
import { findGuildUsersInPrediction } from "../../db-interactions/prediction-entries/db-prediction-entries";
import { findPredictionById } from "../../db-interactions/predictions/db-predictions";
import { findUserGuildMembership } from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import { checkPointsMessageButton } from "../buttons/check-name-button";
import { predictionEndMenuFunc } from "../context-menus/prediction-end-menu";
import Command from "./CommandInterface";
import predictionStart from "./prediction-start";

// finishes a given prediction

const predictionUserInit: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-finish")
		.setDescription("Finish a prediction with a given ID")
		.addStringOption((str) =>
			str
				.setName("predictionid")
				.setRequired(true)
				.setDescription("The necessary prediction ID")
		),
	async execute(interaction: CommandInteraction) {
		try {
			await interaction.deferReply({ ephemeral: true });

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

			const predictionId = interaction.options.get("predictionid", true).value;

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

			const actionRow = new ActionRowBuilder<any>().addComponents(
			selectMenu
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
	},
};

export default predictionUserInit;