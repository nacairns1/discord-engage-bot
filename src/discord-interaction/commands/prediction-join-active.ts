import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./CommandInterface";

// the user joins the active prediction with the given id.

const predictionUserInit:Command = {
	data: new SlashCommandBuilder().setName("prediction-join-active").setDescription("Joins an active prediction"),
	async execute(interaction:CommandInteraction) {
    }
};

export default predictionUserInit;