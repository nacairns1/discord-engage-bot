import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder, User } from "discord.js";
import { findUserGuildMembership } from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import dayjs from "dayjs";
let localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

import Command from "./CommandInterface";

// returns the points for the invoking user

const predictionPointsUser: Command = {
	data: new SlashCommandBuilder()
		.setName("user-info")
		.setDescription("See your earned points"),
	async execute(interaction: CommandInteraction) {
		const user = interaction.user;
		const guildId = interaction.guild?.id;
		if (guildId === undefined) return;

		try {
			await interaction.deferReply({ ephemeral: true });
			const points = await findUserGuildMembership(user.id, guildId);
			if (points === null) throw Error("No user found");
			if (points.admin === null) points.admin = false;
			if (points.manager === null) points.manager = false;

			const userMention = `<@${user.id}>`;
			const timeJoined = `${dayjs(points.timeCreated).format(
				"dddd, MMMM D, YYYY h:mm A"
			)} EDT`;

			const embed = pointsEmbedGenerator(
				userMention,
				timeJoined,
				points.points,
				points.admin,
				points.manager
			);

			await interaction.followUp({
				content: `Here's your <@${user.id}> information in ${interaction.guild?.name}`,
				embeds: [embed],
				ephemeral: true,
			});

		} catch (e) {
			await user.send(`Error when finding your user data. Have you opted in yet? The opt-in should be in a server designated channel or do so manually with /prediction-user-init in a server this bot is in.`);
			console.error(e);
		}
	},
};

const pointsEmbedGenerator = (
	userId: string,
	timeOptedIn: string,
	points: number,
	admin: boolean,
	manager: boolean
) => {
	const permissions = admin ? "Admin" : manager ? "Manager" : "Player";

	return new EmbedBuilder()
		.setAuthor({ name: "Predictions Bot" })
		.setTitle(userId)
		.setFields([
			{ name: "Points" , value: `${points}`},
			{ name: "Time Joined", value: timeOptedIn },
			{ name: "Role Level", value: permissions },
		]);
};
export default predictionPointsUser;
