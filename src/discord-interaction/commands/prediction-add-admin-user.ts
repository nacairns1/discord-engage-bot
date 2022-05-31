import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./CommandInterface";

// add one specific admin to have the prediction admin privelege. Adds role if role is set for the server.

const predictionUserInit:Command = {
	data: new SlashCommandBuilder().setName("prediction-add-admin").setDescription("Gives a user prediction admin priveleges"),
	async execute(interaction:CommandInteraction) {
    }
};

export default predictionUserInit;