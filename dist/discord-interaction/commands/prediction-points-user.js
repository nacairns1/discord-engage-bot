"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const userGuildMemberships_1 = require("../../db-interactions/userGuildMemberships/userGuildMemberships");
const dayjs_1 = __importDefault(require("dayjs"));
let localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs_1.default.extend(localizedFormat);
// returns the points for the invoking user
const predictionPointsUser = {
    data: new builders_1.SlashCommandBuilder()
        .setName("user-info")
        .setDescription("See your earned points"),
    async execute(interaction) {
        var _a, _b;
        const user = interaction.user;
        const guildId = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (guildId === undefined)
            return;
        try {
            await interaction.deferReply({ ephemeral: true });
            const points = await (0, userGuildMemberships_1.findUserGuildMembership)(user.id, guildId);
            if (points === null)
                throw Error("No user found");
            if (points.admin === null)
                points.admin = false;
            if (points.manager === null)
                points.manager = false;
            const userMention = `<@${user.id}>`;
            const timeJoined = `${(0, dayjs_1.default)(points.timeCreated).format("dddd, MMMM D, YYYY h:mm A")} EDT`;
            const embed = pointsEmbedGenerator(userMention, timeJoined, points.points, points.admin, points.manager);
            await interaction.followUp({
                content: `Here's your <@${user.id}> information in ${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}`,
                embeds: [embed],
                ephemeral: true,
            });
        }
        catch (e) {
            await user.send(`Error when finding your user data. Have you opted in yet? The opt-in should be in a server designated channel or do so manually with /prediction-user-init in a server this bot is in.`);
            console.error(e);
        }
    },
};
const pointsEmbedGenerator = (userId, timeOptedIn, points, admin, manager) => {
    const permissions = admin ? "Admin" : manager ? "Manager" : "Player";
    return new discord_js_1.EmbedBuilder()
        .setAuthor({ name: "Predictions Bot" })
        .setTitle("User Info!")
        .setFields([
        { name: "Points", value: `${points}` },
        { name: "Time Joined", value: timeOptedIn },
        { name: "Role Level", value: permissions },
    ]);
};
exports.default = predictionPointsUser;
