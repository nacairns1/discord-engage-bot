"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementUserPoints = exports.updateUserPoints = exports.updateUserManagerPrivilege = exports.updateUserAdminPrivilege = exports.addNewUserGuildMembership = exports.findUserGuildMembership = exports.findAllGuildMemberShips = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const findAllGuildMemberShips = async () => {
    const userGuildMemberships = await prisma.userGuildMemberships.findMany();
    return userGuildMemberships;
};
exports.findAllGuildMemberShips = findAllGuildMemberShips;
const findUserGuildMembership = async (userId, guildId) => {
    const userGuildMembership = await prisma.userGuildMemberships.findUnique({
        where: { userId_guildId: { userId, guildId } },
    });
    return userGuildMembership;
};
exports.findUserGuildMembership = findUserGuildMembership;
const addNewUserGuildMembership = async (userId, guildId, points = 0, admin = false) => {
    const userGuildMembership = await prisma.userGuildMemberships.create({
        data: {
            userId,
            guildId,
            points,
            admin,
            timeCreated: (0, dayjs_1.default)().toISOString(),
        },
    });
    return userGuildMembership;
};
exports.addNewUserGuildMembership = addNewUserGuildMembership;
const updateUserAdminPrivilege = async (userId, guildId, admin) => {
    const userGuildMembership = await prisma.userGuildMemberships.update({
        where: { userId_guildId: { userId, guildId } },
        data: { admin },
    });
    return userGuildMembership;
};
exports.updateUserAdminPrivilege = updateUserAdminPrivilege;
const updateUserManagerPrivilege = async (userId, guildId, manager) => {
    await prisma.userGuildMemberships.update({
        where: { userId_guildId: { userId, guildId } },
        data: { manager },
    });
};
exports.updateUserManagerPrivilege = updateUserManagerPrivilege;
const updateUserPoints = async (userId, guildId, points) => {
    const updatedMemberPoints = await prisma.userGuildMemberships.update({
        where: { userId_guildId: { userId, guildId } },
        data: {
            points,
        },
    });
    return updatedMemberPoints;
};
exports.updateUserPoints = updateUserPoints;
const incrementUserPoints = async (userId, guildId, points) => {
    try {
        const updatedMemberPoints = await prisma.userGuildMemberships.update({
            where: { userId_guildId: { userId, guildId } },
            data: {
                points: {
                    increment: points,
                },
            },
        });
        return updatedMemberPoints;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.incrementUserPoints = incrementUserPoints;
