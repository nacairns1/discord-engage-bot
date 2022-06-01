import { ActionRowBuilder, MessageActionRowComponent, MessageActionRowComponentBuilder } from "discord.js";
import { checkPointsMessageButton } from "../buttons/check-name-button";
import { joinButton, joinMessageButton } from "../buttons/join-button";

export const joinActionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([joinButton]);

export const joinRowInMessage = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([joinMessageButton, checkPointsMessageButton]);