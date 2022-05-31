"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_users_1 = require("../../db-interactions/discord/discord-users");
// manually opting in to the prediction points bot
const predictionUserInit = {
    data: new builders_1.SlashCommandBuilder()
        .setName("prediction-user-init")
        .setDescription("Opts in to earning points"),
    async execute(interaction) {
        var _a, _b, _c;
        const user = interaction.user;
        const guildName = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.name;
        if (guildName === undefined || ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id) === undefined)
            return;
        try {
            const userNew = await (0, discord_users_1.addNewDiscordUserInGuild)(user.id, (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id, 500, false);
            await interaction.reply("working...");
            await interaction.deleteReply();
            if (userNew === null)
                return null;
            await user.send(`Successfully added ${user.username} to prediction points for server: ${guildName} You've earned 500 points to start!`);
        }
        catch (e) {
            await user.send(`Error when adding your user data. 
			
Has your guild been added yet? A server manager needs to call \`/prediction-server initialize\` first`);
            console.error(e);
        }
    },
};
exports.default = predictionUserInit;
