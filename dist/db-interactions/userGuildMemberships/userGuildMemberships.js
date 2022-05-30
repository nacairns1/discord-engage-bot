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
exports.incrementUserPoints = exports.updateUserPoints = exports.updateUserAdminPrivelege = exports.addNewUserGuildMembership = exports.findUserGuildMembership = exports.findAllGuildMemberShips = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const findAllGuildMemberShips = () => __awaiter(void 0, void 0, void 0, function* () {
    const userGuildMemberships = yield prisma.userGuildMemberships.findMany();
    console.log(userGuildMemberships);
    return userGuildMemberships;
});
exports.findAllGuildMemberShips = findAllGuildMemberShips;
const findUserGuildMembership = (userId, guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const userGuildMembership = yield prisma.userGuildMemberships.findUnique({
        where: { userId_guildId: { userId, guildId } },
    });
    console.log(userGuildMembership);
    return userGuildMembership;
});
exports.findUserGuildMembership = findUserGuildMembership;
const addNewUserGuildMembership = (userId, guildId, points = 0, admin = false) => __awaiter(void 0, void 0, void 0, function* () {
    const userGuildMembership = yield prisma.userGuildMemberships.create({
        data: {
            userId,
            guildId,
            points,
            admin,
            timeCreated: (0, dayjs_1.default)().toISOString(),
        },
    });
    return userGuildMembership;
});
exports.addNewUserGuildMembership = addNewUserGuildMembership;
const updateUserAdminPrivelege = (userId, guildId, admin) => __awaiter(void 0, void 0, void 0, function* () {
    const userGuildMembership = yield prisma.userGuildMemberships.update({
        where: { userId_guildId: { userId, guildId } },
        data: { admin },
    });
    console.log(userGuildMembership);
    return userGuildMembership;
});
exports.updateUserAdminPrivelege = updateUserAdminPrivelege;
const updateUserPoints = (userId, guildId, points) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedMemberPoints = yield prisma.userGuildMemberships.update({
        where: { userId_guildId: { userId, guildId } },
        data: {
            points,
        },
    });
    console.log(updatedMemberPoints);
    return updatedMemberPoints;
});
exports.updateUserPoints = updateUserPoints;
const incrementUserPoints = (userId, guildId, points) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedMemberPoints = yield prisma.userGuildMemberships.update({
            where: { userId_guildId: { userId, guildId } },
            data: {
                points: {
                    increment: points,
                },
            },
        });
        console.log(updatedMemberPoints);
        return updatedMemberPoints;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.incrementUserPoints = incrementUserPoints;
