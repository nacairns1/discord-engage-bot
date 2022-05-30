import {
	PredictionEntries,
	PrismaClient,
	UserGuildMemberships,
	Users,
} from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const findAllGuildMemberShips = async (): Promise<
	UserGuildMemberships[]
> => {
	const userGuildMemberships = await prisma.userGuildMemberships.findMany();
	console.log(userGuildMemberships);
	return userGuildMemberships;
};

export const findUserGuildMembership = async (
	userId: string,
	guildId: string
) => {
	const userGuildMembership = await prisma.userGuildMemberships.findUnique({
		where: { userId_guildId: { userId, guildId } },
	});
	console.log(userGuildMembership);
	return userGuildMembership;
};

export const addNewUserGuildMembership = async (
	userId: string,
	guildId: string,
	points: number = 0,
	admin: boolean = false
) => {
	const userGuildMembership = await prisma.userGuildMemberships.create({
		data: {
			userId,
			guildId,
			points,
			admin,
			timeCreated: dayjs().toISOString(),
		},
	});
	return userGuildMembership;
};

export const updateUserAdminPrivelege = async (
	userId: string,
	guildId: string,
	admin: boolean
) => {
	const userGuildMembership = await prisma.userGuildMemberships.update({
		where: { userId_guildId: { userId, guildId } },
		data: { admin },
	});
	console.log(userGuildMembership);
	return userGuildMembership;
};

export const updateUserPoints = async (
	userId: string,
	guildId: string,
	points: number
) => {
	const updatedMemberPoints = await prisma.userGuildMemberships.update({
		where: { userId_guildId: { userId, guildId } },
		data: {
			points,
		},
	});
	console.log(updatedMemberPoints);
	return updatedMemberPoints;
};

export const incrementUserPoints = async (
	userId: string,
	guildId: string,
	points: number
) => {
	try {
		const updatedMemberPoints = await prisma.userGuildMemberships.update({
			where: { userId_guildId: { userId, guildId } },
			data: {
				points: {
					increment: points,
				},
			},
		});
		console.log(updatedMemberPoints);
		return updatedMemberPoints;
	} catch (e) {
        console.error(e);
		return null;
	}
};
