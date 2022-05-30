"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewGuild = exports.findAllGuilds = exports.findGuild = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
// returns information about one guild
const findGuild = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = yield prisma.guilds.findFirst({
        select: { guildId: true, timeCreated: true },
        where: { guildId },
    });
    return guild;
});
exports.findGuild = findGuild;
// returns information about all guilds
const findAllGuilds = () => __awaiter(void 0, void 0, void 0, function* () {
    const guilds = yield prisma.guilds.findMany();
    return guilds;
});
exports.findAllGuilds = findAllGuilds;
// adds a new guild if not a duplicate and returns the new guild object. returns null if rejected.
const addNewGuild = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((0, exports.findGuild)(guildId) !== null) {
            console.log("duplicate detected. returning without creating a new guild...");
            return null;
        }
        const newGuild = yield prisma.guilds.create({
            data: { guildId, timeCreated: (0, dayjs_1.default)().toISOString() },
        });
        return newGuild;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.addNewGuild = addNewGuild;
