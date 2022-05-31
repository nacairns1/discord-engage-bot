import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./CommandInterface";

// command to give a user points (must be positive value)

const predictionUserInit:Command = {
	data: new SlashCommandBuilder().setName("prediction-give-user").setDescription("Give a user points"),
	async execute(interaction:CommandInteraction) {
    }
};

export default predictionUserInit;