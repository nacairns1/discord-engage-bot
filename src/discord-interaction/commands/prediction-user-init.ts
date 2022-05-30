import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./CommandInterface";

// manually opting in to the prediction points bot

const predictionUserInit: Command = {
	data: new SlashCommandBuilder()
		.setName("prediction-user-init")
		.setDescription("Opts in to earning prediction points on this server"),
	async execute(interaction: CommandInteraction) {},
};

export default predictionUserInit;
