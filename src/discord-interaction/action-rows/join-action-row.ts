import { ActionRowBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageActionRowComponent } from "discord.js";
import { checkPointsMessageButton } from "../buttons/check-name-button";
import { joinButton, joinMessageButton } from "../buttons/join-button";

export const joinActionRow = new ActionRowBuilder().addComponents(joinButton);

export const joinRowInMessage = new MessageActionRow().addComponents(joinMessageButton, checkPointsMessageButton);