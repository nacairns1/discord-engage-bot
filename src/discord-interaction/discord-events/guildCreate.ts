import { Guild, Message } from "discord.js";
import { addNewDiscordGuild } from "../../db-interactions/discord/discord-guilds";
import { updateDiscordUserPointsOnEngagement } from "../../db-interactions/discord/discord-transactions";
import { addNewDiscordUserInGuild } from "../../db-interactions/discord/discord-users";
import { addNewGuild } from "../../db-interactions/guilds/db-guilds";
import { addCommandsToGuild } from "../scripts/deploy-commands";
import Event from "./EventInterface";

const info = `This bot tracks the engagement of users in your server and allocates points to your users. \n In order to do so, this application notices when users are active in the server. This includes sending messages, joining voice, reacting to content, etc. \n Besides the time of the interaction, no information about the messages or voice content are stored.

Predictions are the notable feature of this bot. Type /prediction-start to start a new prediction. 

The relevant information stored about these predictions are the user chosen outcomes and the eventual decided outcomes. This is how the bot can parse whether users win or lose.

The bot aims to be as minimalistic as possible to not infringe on your discord experience. The full list of stored data is available on this projects github (https://github.com/nacairns1/discord-engage-bot)

To get started in your server, type \`/prediction-setup\` **in the server where the bot has been added** in order to activate the bot's full capabilities.  

You are automatically granted prediction admin privilege. You can add more admins add admins extremely sparingly. They can send and remove user points as well as start and end any prediciton. 

Managers are members who can start and end only the predictions that they create without the ability to change other user's privileges. Current users who have opted in and are members of a certain role in your server can all be given manager privilege via \`/prediction-manager-role\``

const guildCreate: Event = {
	name: "guildCreate",
	async execute(guild: Guild) {

        const owner = await guild.fetchOwner();

		const guildId:string = guild.id;
		
        
		if (guildId === null) return;
		try {
            await owner.send('Adding application to new server...');
            await addCommandsToGuild(guildId);
            await owner.send('Success!');
            await owner.send('Adding guild to prediction points db...');
            await addNewDiscordGuild(guildId);
            await owner.send('Success!');
            await addNewDiscordUserInGuild(owner.id, guildId, 500, true);
            await owner.send(info);
		} catch (e) {
            await owner.send('Error adding the application to a new server')
			console.error(e);
			return;
		}
	},
};

export default guildCreate;