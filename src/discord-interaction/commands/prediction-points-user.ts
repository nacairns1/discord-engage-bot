import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./CommandInterface";

// returns the points for the invoking user

const predictionUserInit:Command = {
	data: new SlashCommandBuilder().setName("prediction-points-user").setDescription("See your earned points on this server"),
	async execute(interaction:CommandInteraction) {
    }
};

export default predictionUserInit;