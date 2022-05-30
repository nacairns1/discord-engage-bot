import { PredictionEntries, PrismaClient, Users } from "@prisma/client";
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export const findAllUsers = async (): Promise<Users[]> => {
    const users = await prisma.users.findMany();
    console.log(users);
    return users;
}

export const findUser = async(userId:string) => {
    const user = await prisma.users.findUnique({where: {userId}});
    console.log(user);
    return user;
}

export const addNewUser = async(userId: string) => {
    const user = await prisma.users.create({data:{userId, timeCreated: dayjs().toISOString()}});
    return user;
}