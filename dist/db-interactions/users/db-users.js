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
exports.updateAllAdminStatusToFalse = exports.updateAdminStatus = exports.addNewUserToGuild = exports.findUserInGuild = exports.findGuildUsers = exports.findAllUsers = void 0;
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
    const guildUsers = yield prisma.users.findMany({ where: { guildId }, });
    console.log(guildUsers);
    return guildUsers;
});
exports.findGuildUsers = findGuildUsers;
// returns information about a user given a userId and a guildId
const findUserInGuild = (userId, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findUnique({ where: { userId_guildId: { guildId, userId } } });
    console.log(user);
    return user;
});
exports.findUserInGuild = findUserInGuild;
// adds a new user to a guild and returns their guild information
const addNewUserToGuild = (userId, guildId, points = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const userCheck = yield (0, exports.findUserInGuild)(userId, guildId);
    if (userCheck !== null) {
        console.log('duplicate detected when adding user to guild. Returning...');
    }
    const newUser = yield prisma.users.create({ data: { userId: userId, guildId: guildId, points: points, timeCreated: (0, dayjs_1.default)().toISOString() } });
    console.log(newUser);
    return newUser;
});
exports.addNewUserToGuild = addNewUserToGuild;
const updateAdminStatus = (userId, guildId, admin) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield prisma.users.update({ where: { userId_guildId: { userId, guildId } }, data: {
            admin
        } });
    console.log(updatedUser);
    return updatedUser;
});
exports.updateAdminStatus = updateAdminStatus;
const updateAllAdminStatusToFalse = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.users.updateMany({ data: { admin: false } });
});
exports.updateAllAdminStatusToFalse = updateAllAdminStatusToFalse;
