"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dayjs_1 = __importDefault(require("dayjs"));
const discord_transactions_1 = require("./discord/discord-transactions");
const seed = faker_1.faker.seed(123);
const guilds = [];
const users = [];
const userGuildMemberships = [];
const predictions = [];
const predictionEntries = [];
const outcome_1 = "believe";
const outcome_2 = "doubt";
const generateData = async () => {
    console.log("generating guilds....");
    for (let i = 0; i < 5; i++) {
        guilds.push({
            guildId: faker_1.faker.company.bsBuzz(),
            timeCreated: (0, dayjs_1.default)().toISOString(),
        });
    }
    console.log("generating users....");
    for (let i = 0; i < 20; i++) {
        users.push({
            userId: faker_1.faker.name.firstName(),
            timeCreated: (0, dayjs_1.default)().toISOString(),
        });
    }
    console.log("generating userGuildMemberships...");
    for (let i = 0; i < 50; i++) {
        const randUserIndex = Math.round(Math.random() * (users.length - 1));
        const randGuildIndex = Math.round(Math.random() * (guilds.length - 1));
        const { userId } = users[randUserIndex];
        const { guildId } = guilds[randGuildIndex];
        userGuildMemberships.push({
            userId,
            guildId,
            points: Math.ceil(Math.random() * 10000 * (Math.random() * 5)),
            admin: false,
            manager: false,
            timeCreated: (0, dayjs_1.default)().toISOString(),
            lastEarnedPonts: "n/a",
        });
    }
    console.log("filtering UGM duplicates...");
    const dupReducer = (indArr, ugm) => {
        const uIdIndividualCheck = indArr.findIndex((nUgm) => ugm.userId === nUgm.userId) === -1;
        const gIdIndividualCheck = indArr.findIndex((nUgm) => ugm.guildId === nUgm.guildId) === -1;
        if (uIdIndividualCheck || gIdIndividualCheck) {
            indArr.push(ugm);
            return indArr;
        }
        return indArr;
    };
    const filteredUGMArr = userGuildMemberships.reduce(dupReducer, []);
    console.log("creating prediction data");
    for (let i = 0; i < 10; i++) {
        const randUserIndex = Math.round(Math.random() * (users.length - 1));
        const predictionId = faker_1.faker.random.numeric(6);
        const randGuildIndex = Math.round(Math.random() * (guilds.length - 1));
        const active = Math.random() > 0.5;
        const d_outcome = !active
            ? Math.random() > 0.5
                ? outcome_1
                : outcome_2
            : "n/a";
        const timeEnded = active ? (0, dayjs_1.default)().toISOString() : 'n/a';
        predictions.push({
            predictionId,
            creatorId: users[randUserIndex].userId,
            guildId: guilds[randGuildIndex].guildId,
            timeCreated: (0, dayjs_1.default)().toISOString(),
            outcome_1,
            outcome_2,
            timeEnded,
            active,
            isOpen: false,
            decided_outcome: d_outcome,
        });
    }
    console.log('generating prediction entries...');
    for (let i = 0; i < 100; i++) {
        const randUGMIndex = Math.round(Math.random() * (filteredUGMArr.length - 1));
        const randPredictionIndex = Math.round(Math.random() * (predictions.length - 1));
        const predicted_outcome = Math.random() > .5 ? outcome_1 : outcome_2;
        predictionEntries.push({
            predictionId: predictions[randPredictionIndex].predictionId,
            userId: filteredUGMArr[randUGMIndex].userId,
            guildId: filteredUGMArr[randUGMIndex].guildId,
            timeCreated: (0, dayjs_1.default)().toISOString(),
            wageredPoints: Math.round(Math.random() * (1000) * (Math.random() * 5)),
            predicted_outcome,
            decided_outcome: 'n/a',
            earnedPoints: 0,
            timeEdited: 'n/a'
        });
    }
    console.log("filtering PE duplicates...");
    const dupPEReducer = (indArr, pe) => {
        const pIdIndividualCheck = indArr.findIndex((npe) => npe.predictionId === pe.predictionId) === -1;
        const uIdIndividualCheck = indArr.findIndex((npe) => pe.userId === npe.userId) === -1;
        const gIdIndividualCheck = indArr.findIndex((npe) => pe.guildId === npe.guildId) === -1;
        if (uIdIndividualCheck || gIdIndividualCheck || pIdIndividualCheck) {
            indArr.push(pe);
            return indArr;
        }
        return indArr;
    };
    let filteredPEArr = predictionEntries.reduce(dupPEReducer, []);
    const usersPromiseArr = users.map(user => {
        return prisma.users.create({ data: user });
    });
    const guildsPromiseArr = guilds.map(guild => {
        return prisma.guilds.create({ data: guild });
    });
    const predictionsPromiseArr = predictions.map(prediction => {
        return prisma.predictions.create({ data: prediction });
    });
    const filteredUGMPromises = filteredUGMArr.map(ugm => {
        return prisma.userGuildMemberships.create({ data: ugm });
    });
    const filteredPEPromises = filteredPEArr.map(pe => {
        return prisma.predictionEntries.create({ data: pe });
    });
    console.log('attempting adding data to db....');
    await prisma.$transaction([...usersPromiseArr]);
    console.log('users complete. attempting guilds....');
    await prisma.$transaction([...guildsPromiseArr]);
    console.log('guilds complete. attempting predictions....');
    await prisma.$transaction([...predictionsPromiseArr]);
    console.log('predictions complete. attempting ugms....');
    await prisma.$transaction([...filteredUGMPromises]);
    console.log('ugm complete. attempting pe....');
    await prisma.$transaction([...filteredPEPromises]);
    console.log('success');
};
(0, discord_transactions_1.cashOutPlayers)('577637', 'doubt');
/*
*   Uncomment and run this command to generate fake data in your db for testing purposes
*   generateData();
*/ 
