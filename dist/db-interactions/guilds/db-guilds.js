"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewGuild = exports.findAllGuilds = exports.findGuild = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
// returns information about one guild
const findGuild = async (guildId) => {
    const guild = await prisma.guilds.findFirst({
        select: { guildId: true, timeCreated: true },
        where: { guildId },
    });
    return guild;
};
exports.findGuild = findGuild;
// returns information about all guilds
const findAllGuilds = async () => {
    const guilds = await prisma.guilds.findMany();
    return guilds;
};
exports.findAllGuilds = findAllGuilds;
// adds a new guild if not a duplicate and returns the new guild object. returns null if rejected.
const addNewGuild = async (guildId) => {
    try {
        const guild = await (0, exports.findGuild)(guildId);
        if (guild !== null) {
            console.log("duplicate detected. returning without creating a new guild...");
            return guild;
        }
        const newGuild = await prisma.guilds.create({
            data: { guildId, timeCreated: (0, dayjs_1.default)().toISOString() },
        });
        return newGuild;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.addNewGuild = addNewGuild;
