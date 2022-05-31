import {
	SlashCommandBooleanOption,
	SlashCommandBuilder,
	SlashCommandIntegerOption,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	SlashCommandUserOption,
} from "@discordjs/builders";

export default interface Command {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: Function;
}
