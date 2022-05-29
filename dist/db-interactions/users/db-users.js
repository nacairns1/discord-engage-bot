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
exports.addNewUserToGuild = exports.findUserInGuild = exports.findGuildUsers = exports.findAllUsers = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
// returns information about all users
const findAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.users.findMany();
    console.log(users);
    return users;
});
exports.findAllUsers = findAllUsers;
//returns information about all users in a given guild
const findGuildUsers = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const guildUsers = yield prisma.users.findMany({ where: { guildId }, select: { guildId: true, userId: true, points: true, timeCreated: true } });
    console.log(guildUsers);
    return guildUsers;
});
exports.findGuildUsers = findGuildUsers;
// returns information about a user given a userId and a guildId
const findUserInGuild = (userId, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findFirst({ select: { guildId: true, userId: true, points: true, timeCreated: true }, where: { guildId, userId } });
    console.log(user);
    return null;
});
exports.findUserInGuild = findUserInGuild;
// adds a new user to a guild and returns their guild information
const addNewUserToGuild = (userId, guildId, points = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield prisma.users.create({ data: { userId: userId, guildId: guildId, points: points, timeCreated: (0, dayjs_1.default)().toISOString() } });
    console.log(newUser);
    return newUser;
});
exports.addNewUserToGuild = addNewUserToGuild;
