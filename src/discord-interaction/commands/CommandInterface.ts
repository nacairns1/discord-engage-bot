import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders'

export default interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
    execute: Function
}