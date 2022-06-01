import {
	ActionRowBuilder,
	ModalBuilder,
	SelectMenuBuilder,
	TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "discord-api-types/v10";
import {
	ButtonInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu,
	Modal,
	ModalActionRowComponent,
	ModalSubmitInteraction,
	TextInputComponent,
} from "discord.js";

export const predictionEntryModalGenerator = (
	predictionId: string,
	predicted_outcome: string
) => {
	const pointsInput = new TextInputComponent()
		.setCustomId("prediction-popup")
		.setLabel(`How many points do you want to wager?`)
		.setPlaceholder("MUST Be a Number")
		.setRequired(true)
		.setStyle("SHORT");

	const pidHolder = new TextInputComponent()
		.setCustomId("modal-join-pid")
		.setValue(predictionId)
		.setLabel("***DO NOT TOUCH***")
		.setRequired(true)
		.setStyle("SHORT");
	const outHolder = new TextInputComponent()
		.setCustomId("modal-join-out")
		.setLabel("***DO NOT TOUCH***")
		.setValue(predicted_outcome)
		.setStyle("SHORT");

	const hobbiesInput = new MessageSelectMenu()
		.setCustomId("predicted-outcome")
		.addOptions(
			{ value: `test`, label: `Outcome-1 ${predictionId}` },
			{ value: `test3`, label: `Outcome-2 ${predictionId}` }
		);

	return new Modal()
		.setCustomId(`enter-modal`)
		.setTitle(`Prediction Entry for ${predicted_outcome}`)
		.setComponents(
			new MessageActionRow<ModalActionRowComponent>().setComponents(
				pointsInput
			),
            new MessageActionRow<any>().setComponents(hobbiesInput),
			new MessageActionRow<ModalActionRowComponent>().setComponents(pidHolder),
			new MessageActionRow<ModalActionRowComponent>().setComponents(outHolder)
		);
};

export const modalEnterSubmitHandler = async (
	interaction: ModalSubmitInteraction
) => {
	console.log(interaction);
};
