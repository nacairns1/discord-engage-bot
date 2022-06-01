import { MessageEmbed } from "discord.js";

export const helpEmbed = new MessageEmbed()
	.setAuthor({
		name: "PredictionBot",
		url: "https://github.com/nacairns1/discord-engage-bot",
	})
	.setTitle("Prediction Bot Info")
	.setDescription("Information about the Prediction Bot")
	.addFields(
		{
			name: "Points",
			value:
				"This bot gives points to the users on the server based on activity. \n Making messages, message reactions, and joining voice channels are all examples of engagement!",
		},
		{
			name: "Tracking and Data",
			value:
				"This bot tracks minimal user data in order to allocate points based on activity.\n The bot stores none of the message or channel data. The bot does store prediction information to correctly create the predictions.",
		},
        {
            name: "Opt in and Get Started",
            value: "Due to the fact that not everyone might want their data tracked, this bot is opt-in only. Click the join button below to join and start earning points! You can also type \`/prediction-user-init\`"
        }
	);
