"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// change this section from a REST Api to an api for our discord bot to talk back and forth on the same application. 
// No need to create a whole separate web server yet
exports.prisma = new client_1.PrismaClient();
