import {
	Modal,
	TextInputComponent,
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
	MessageEmbed,
	CommandInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Command from "./CommandInterface";
import { checkPointsMessageButton } from "../buttons/check-name-button";
import { findUserGuildMembership } from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import { time } from "console";
import { addNewDiscordPredictionEntry } from "../../db-interactions/discord/discord-transactions";
import { addNewPredictionInGuildByCreator } from "../../db-interactions/discord/discord-predictions";
import {
	findPredictionById,
	updatePredictionToClosed,
} from "../../db-interactions/predictions/db-predictions";
import { findGuildUsersInPrediction } from "../../db-interactions/prediction-entries/db-prediction-entries";
import messageCreate from "../discord-events/messageCreate";
import { closedMessageButton, enterButton, enterMessageButton } from "../buttons/enter-prediction-buton";

// starts a new prediction

const predictionStart: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-start")
		.setDescription("Creates a new active Prediction")
		.addStringOption((option) =>
			option
				.setName("outcome_1")
				.setDescription("The first of two possible outcomes")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("outcome_2")
				.setDescription("The other possible outcome")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("time_open")
				.setDescription("length of time users can enter")
				.addChoices(
					{ value: 30, name: "short" },
					{ value: 60, name: "medium" },
					{ value: 90, name: "long" }
				)
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply();

		const predictionId = interaction.id;
		const user = interaction.user;
		const outcome_1 = interaction.options.getString("outcome_1");
		const outcome_2 = interaction.options.getString("outcome_2");
		let time_open = interaction.options.getInteger("time_open");

		if (
			interaction.guildId === null ||
			outcome_1 === null ||
			outcome_2 === null ||
			time_open === null
		)
			return;
		try {
			const userCheck = await findUserGuildMembership(
				user.id,
				interaction.guildId
			);
			if (userCheck === null || !userCheck.admin) {
				await user.send(
					"You do not have permission to start a prediction in this server."
				);
				return;
			}
		} catch (e) {
			console.error(e);
			return;
		}
		let prediction;
		try {
			prediction = await addNewPredictionInGuildByCreator(
				predictionId,
				interaction.guildId,
				user.id,
				outcome_1,
				outcome_2
			);
		} catch (e) {
			return null;
		}

		function timeout(ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}
		while (time_open > 0) {
			const message = await embedPredictionBuilder(
				predictionId,
				interaction.guildId,
				time_open
			);
			if (message.components === undefined || message.embeds === undefined)
				return;

			await interaction.editReply({
				content: message.content,
				embeds: message.embeds,
				components: [message.components],
			});
			await timeout(1000);
			time_open--;
		}

		const finalMessage = await embedPredictionBuilder(
			predictionId,
			interaction.guildId,
			time_open
		);

		await interaction.editReply({
			content: "Prediction Closed!",
			embeds: finalMessage.embeds,
			components: [new MessageActionRow().addComponents(closedMessageButton, checkPointsMessageButton)]
		});
		const update = await updatePredictionToClosed(predictionId);
		if (update === null) {
			await interaction.followUp({
				content:
					"Error closing the prediction to new entries. Please check to see the prediction is still considered active (this means closable)",
				ephemeral: true,
			});
			return;
		}
		console.log(`prediction ${predictionId} closed successfully!`);


	},
};

const embedPredictionBuilder = async (
	predictionId: string,
	guildId: string,
	time: number
) => {
	let o_1_points = 0;
	let o_2_points = 0;
	let o_2_players = 0;
	let o_1_players = 0;

	const p = await findPredictionById(predictionId);
	const gm = await findGuildUsersInPrediction(guildId, predictionId);

	if (p === null) return { content: "No prediction found..." };

	let o_1_playerMax = 0;
	let o_1_playerMaxName;
	let o_2_playerMax = 0;
	let o_2_playerMaxName;

	if (gm === null) {
		o_1_points = 0;
		o_2_points = 0;
		o_1_players = 0;
		o_2_players = 0;
	} else {
		gm.map((pe) => {
			if (pe.predicted_outcome === p.outcome_1) {
				o_1_players++;
				o_1_points += pe.wageredPoints;
				if (pe.wageredPoints > o_1_playerMax) {
					o_1_playerMax = pe.wageredPoints;
					o_1_playerMaxName = pe.userId;
				}
			} else if (pe.predicted_outcome === p.outcome_2) {
				o_2_players++;
				o_2_points += pe.wageredPoints;
				if (pe.wageredPoints > o_2_playerMax) {
					o_2_playerMax = pe.wageredPoints;
					o_2_playerMaxName = pe.userId;
				}
			}
		});
	}

	const predictionEmbed = new MessageEmbed()
		.setTitle(`Prediction Started! `)
		.setDescription(
			`Choose between: **${p.outcome_1}** __OR__  **${p.outcome_2}**`
		)
		.addFields(
			{
				name: `PredictionID: `,
				value: `${p.predictionId}`,
				inline: false,
			},
			{
				name: `${p.outcome_1}`,
				value: `Points wagered: ${o_1_points} \n Highest Bet: ----- \n #Players: ${o_1_players} Players`,
				inline: true,
			},
			{
				name: `${p.outcome_2}`,
				value: `Points wagered: ${o_2_points} \n Highest Bet: ----- \n #Players: ${o_2_points} Players`,
				inline: true,
			},
			{
				name: `${time}`,
				value: "Seconds remaining...",
				inline: false,
			}
		)
		.setTimestamp()
		.setFooter({
			text: "Prediction Bot",
		});

	const submitRow = new MessageActionRow().addComponents(
		enterMessageButton(predictionId),
		checkPointsMessageButton
	);

	return {
		content: "Prediction Open!!",
		embeds: [predictionEmbed],
		components: submitRow,
	};
};

export default predictionStart;
