"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const v10_1 = require("discord-api-types/v10");
const discord_guilds_1 = require("../../db-interactions/discord/discord-guilds");
const discord_users_1 = require("../../db-interactions/discord/discord-users");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
const join_action_row_1 = require("../action-rows/join-action-row");
// initializes the guild in the prediction db. Necessary for other functionality.
// if given a channel, sends an initial message with a button to begin tracking as well as gain points.
// these values will be manual right now but can be refactored later and added to the db as default values and thus customizable.
const predictionServer = {
    data: new builders_1.SlashCommandBuilder()
        .setName("prediction-server")
        .setDescription("Set up bot")
        .addSubcommand((subcommand) => subcommand
        .setName("initialize")
        .setDescription("Begins points watching")
        .addChannelOption((channel) => channel
        .addChannelTypes(v10_1.ChannelType.GuildText)
        .setName("init-channel")
        .setDescription("Sends public starting info")
        .setRequired(true))),
    async execute(interaction) {
        var _a, _b;
        const subcommand = interaction.options.getSubcommand();
        const optIn = interaction.options.getBoolean("guild");
        const initChannel = interaction.options.getChannel("init-channel");
        if (((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) === null || ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id) === undefined)
            return;
        await interaction.reply({ content: "adding server....", fetchReply: true });
        const addNewGuild = await (0, discord_guilds_1.addNewDiscordGuild)(interaction.guild.id);
        await interaction.deleteReply();
        if (initChannel !== null) {
            const initialContent = {
                content: `Welcome to Predictions Points! This bot gives points to the users on the server based on activity and can be used to create predictions. \n This bot tracks minimal user data in order to allocate points based on activity. In order to opt in and get some starter points, click the button below or type \`/prediction-user-init\``,
                components: [join_action_row_1.joinRowInMessage],
            };
            const initChannelid = initChannel.id;
            const owner = await interaction.guild.fetchOwner();
            if (interaction.guildId === null)
                return;
            if (await (0, discord_users_1.addNewDiscordUserInGuild)(owner.id, interaction.guildId, 500, true) === null) {
                console.log('existing user detected. upgrading to admin...');
                await (0, userGuildMemberships_1.updateUserAdminPrivelege)(owner.id, interaction.guildId, true);
            }
            ;
            const channel = interaction.client.channels.cache.get(initChannelid);
            if ((channel === null || channel === void 0 ? void 0 : channel.type) === "GUILD_TEXT") {
                channel.send(initialContent);
            }
        }
    },
};
exports.default = predictionServer;
