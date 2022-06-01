"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewUser = exports.findUser = exports.findAllUsers = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const findAllUsers = async () => {
    const users = await prisma.users.findMany();
    // console.log(users);
    return users;
};
exports.findAllUsers = findAllUsers;
const findUser = async (userId) => {
    const user = await prisma.users.findUnique({ where: { userId } });
    // console.log(user);
    return user;
};
exports.findUser = findUser;
const addNewUser = async (userId) => {
    const user = await prisma.users.create({ data: { userId, timeCreated: (0, dayjs_1.default)().toISOString() } });
    return user;
};
exports.addNewUser = addNewUser;
