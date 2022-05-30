import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./CommandInterface";

// finishes a given prediction

const predictionUserInit:Command = {
	data: new SlashCommandBuilder().setName("prediction-finish").setDescription("Finish a prediction with a given ID"),
	async execute(interaction:CommandInteraction) {
    }
};

export default predictionUserInit;