import { PredictionEntries, PrismaClient, Users } from "@prisma/client";
import dayjs from 'dayjs';

const prisma = new PrismaClient();

// returns information about all users
export const findAllUsers = async ():Promise<Users[] | null> => {
    const users = await prisma.users.findMany();
    console.log(users);
    return users;
}

//returns information about all users in a given guild
export const findGuildUsers = async(guildId:string):Promise<Users[] | null> => {
    const guildUsers = await prisma.users.findMany({where: {guildId}, })
    console.log(guildUsers);
    return guildUsers;
}



// returns information about a user given a userId and a guildId
export const findUserInGuild = async (userId: string, guildId: string):Promise<Users | null> => {
    const user = await prisma.users.findUnique({where:{userId_guildId: {guildId, userId}}})
    console.log(user);
    return user;
}

// adds a new user to a guild and returns their guild information
export const addNewUserToGuild = async(userId: string, guildId: string, points: number = 0 ) : Promise<Users | null> => {
    const userCheck = await findUserInGuild(userId, guildId);
    if (userCheck !== null) {
        console.log('duplicate detected when adding user to guild. Returning...');
    }
    const newUser = await prisma.users.create({data: {userId: userId, guildId: guildId, points: points, timeCreated: dayjs().toISOString()}});
    console.log(newUser);
    return newUser;
}

export const updateAdminStatus = async (userId: string, guildId: string, admin: boolean) => {
    const updatedUser = await prisma.users.update({where: {userId_guildId: {userId, guildId}}, data: {
        admin
    }});
    console.log(updatedUser);
    return updatedUser;
}

export const updateAllAdminStatusToFalse = async () => {
    await prisma.users.updateMany({data: {admin: false}});
}