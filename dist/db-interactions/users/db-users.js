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
exports.addNewUser = exports.findUser = exports.findAllUsers = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const findAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.users.findMany();
    console.log(users);
    return users;
});
exports.findAllUsers = findAllUsers;
const findUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.findUnique({ where: { userId } });
    console.log(user);
    return user;
});
exports.findUser = findUser;
const addNewUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.users.create({ data: { userId, timeCreated: (0, dayjs_1.default)().toISOString() } });
    return user;
});
exports.addNewUser = addNewUser;
