import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./CommandInterface";

// adds one specific role to have the prediction admin privelege. Scrapes the roles and adds them all.

const predictionUserInit:Command = {
	data: new SlashCommandBuilder().setName("prediction-admin-role").setDescription("Sets a new prediction-admin role"),
	async execute(interaction:CommandInteraction) {
    }
};

export default predictionUserInit;