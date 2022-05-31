import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, User } from "discord.js";
import { findUserGuildMembership } from "../../db-interactions/userGuildMemberships/userGuildMemberships";
import { addNewUser } from "../../db-interactions/users/db-users";
import { SnowflakeUtil } from "discord.js";
import dayjs from "dayjs";
let localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);

import Command from "./CommandInterface";

// returns the points for the invoking user

const predictionPointsUser: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-points-user")
		.setDescription("See your earned points"),
	async execute(interaction: CommandInteraction) {
		const user = interaction.user;
		const guildId = interaction.guild?.id;
		if (guildId === undefined) return;

		try {
			await interaction.reply('working...');
			await interaction.deleteReply();
			const points = await findUserGuildMembership(user.id, guildId)
			if (points === null) throw Error('No user found')
			await interaction.followUp({content: `Here's your <@${user.id}> information in ${interaction.guild?.name}

__Points:__ ${points.points}
__Time Initially Opted in:__ ${dayjs(points.timeCreated).format('dddd, MMMM D, YYYY h:mm A')} EDT
__Admin:__ ${points.admin}`, ephemeral: true})	

		} catch (e) {
			await user.send(`Error when finding your user data. Have you opted in yet? 
			
The opt-in should be in a server designated channel or do so manually with /prediction-user-init in a server this bot is in.`);
			console.error(e);
		}
	},
};

export default predictionPointsUser;
