import { PrismaClient, Users } from "@prisma/client";
import dayjs from 'dayjs';

const prisma = new PrismaClient();

// returns information about all users
export const findAllUsers = async ():Promise<Users[] | null> => {
    const users = await prisma.users.findMany();
    console.log(users);
    return users;
}

//returns information about all users in a given guild
export const findGuildUsers = async(guildId:string):Promise<{ guildId: string; userId: string; points: number; timeCreated: string; }[] | null> => {
    const guildUsers = await prisma.users.findMany({where: {guildId}, select: {guildId:true, userId: true, points: true, timeCreated: true}})
    console.log(guildUsers);
    return guildUsers;
}

// returns information about a user given a userId and a guildId
export const findUserInGuild = async (userId: string, guildId: string):Promise<{userId: string, guildId: string, points: number} | null> => {
    const user = await prisma.users.findFirst({select: {guildId:true, userId: true, points: true, timeCreated: true}, where:{guildId, userId}})
    console.log(user);
    return null;
}

// adds a new user to a guild and returns their guild information
export const addNewUserToGuild = async(userId: string, guildId: string, points: number = 0 ) => {
    const newUser = await prisma.users.create({data: {userId: userId, guildId: guildId, points: points, timeCreated: dayjs().toISOString()}});
    console.log(newUser);
    return newUser;
}
