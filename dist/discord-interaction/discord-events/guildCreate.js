"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_guilds_1 = require("../../db-interactions/discord/discord-guilds");
const discord_users_1 = require("../../db-interactions/discord/discord-users");
const deploy_commands_1 = require("../scripts/deploy-commands");
const info = `This bot tracks the engagement of users in your server and allocates points to your users. \n In order to do so, this application notices when users are active in the server. This includes sending messages, joining voice, reacting to content, etc. \n Besides the time of the interaction, no information about the messages or voice content are stored.

Predictions are the notable feature of this bot. Type /prediction-start to start a new prediction. 

The relevant information stored about these predictions are the user chosen outcomes and the eventual decided outcomes. This is how the bot can parse whether users win or lose.

The bot aims to be as minimalistic as possible to not infringe on your discord experience. The full list of stored data is available on this projects github (https://github.com/nacairns1/discord-engage-bot)

To get started in your server, type \`/prediction-server initialize\` **in the server where the bot has been added** in order to activate the bot's full capabilities.  

More command information is available via \`/prediction-help\`. You are automatically granted prediction admin privelege.`;
const guildCreate = {
    name: "guildCreate",
    async execute(guild) {
        const owner = await guild.fetchOwner();
        const guildId = guild.id;
        if (guildId === null)
            return;
        try {
            await owner.send('Adding application to new server...');
            await (0, deploy_commands_1.addCommandsToGuild)(guildId);
            await owner.send('Success!');
            await owner.send('Adding guild to prediction points db...');
            await (0, discord_guilds_1.addNewDiscordGuild)(guildId);
            await owner.send('Success!');
            await (0, discord_users_1.addNewDiscordUserInGuild)(owner.id, guildId, 500, true);
            await owner.send(info);
        }
        catch (e) {
            await owner.send('Error adding the application to a new server');
            console.error(e);
            return;
        }
    },
};
exports.default = guildCreate;
