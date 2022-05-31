import {
	PredictionEntries,
	PrismaClient,
	PrismaPromise,
	UserGuildMemberships,
	Users,
} from "@prisma/client";
import {
	addNewUserGuildMembership,
	findUserGuildMembership,
	incrementUserPoints,
} from "../userGuildMemberships/userGuildMemberships";

import { addNewUser, findUser } from "../users/db-users";
import { updateDiscordUserPointsOnEngagement } from "./discord-transactions";

// returns null on rejected added user from discordId
export const addDiscordUserInGuild = async (
	discordId: string,
	guildId: string,
	points: number = 0,
	admin: boolean = false
): Promise<UserGuildMemberships | null> => {
	try {
		const existingUGM = await findUserGuildMembership(discordId, guildId);
		if (existingUGM) {
			console.log(
				`Existing User/Guild Membership detected ${existingUGM.userId} in ${existingUGM.guildId}. Returning without creating a new membership....`
			);
			return null;
		}
		const existingUser = await findUser(discordId);
		if (existingUser) {
			console.log(
				`Existing User detected. Creating a new guild membership....`
			);
			const updatedUGM = await addNewUserGuildMembership(
				discordId,
				guildId,
				points,
				admin
			);
			console.log(
				`membership updated for ${updatedUGM.userId} in ${guildId} to ${updatedUGM.points}`
			);
			return updatedUGM;
		} else {
			const newUser = await addNewUser(discordId);
			console.log(
				`New User created ${newUser.userId}. Adding new membership....`
			);
			const newUGM = await addNewUserGuildMembership(
				discordId,
				guildId,
				points,
				admin
			);
			return newUGM;
		}
	} catch (e) {
		console.error(e);
		return null;
	}
};

// returns null on rejected user update to add points
export const addPointsToDiscordUserInGuild = async (
	discordId: string,
	guildId: string,
	pointsToAdd: number
): Promise<UserGuildMemberships | null> => {
	try {
		const updatedUser = await incrementUserPoints(
			discordId,
			guildId,
			pointsToAdd
		);
		if (updatedUser === null) {
			await addNewUserGuildMembership(discordId, guildId, pointsToAdd);
		}
		console.log(`${discordId} updated points`);
		return updatedUser;
	} catch (e) {
		console.error(e);
		return null;
	}
};

// returns null on rejected user update to remove points
export const removePointsFromDiscordUserInGuild = async (
	discordId: string,
	guildId: string,
	pointsToRemove: number
): Promise<UserGuildMemberships | null> => {
	try {
		const updatedUser = await incrementUserPoints(
			discordId,
			guildId,
			pointsToRemove * -1
		);
		console.log(`${discordId} updated points`);
		return updatedUser;
	} catch (e) {
		console.error(e);
		return null;
	}
};

export const addPointsToUserOnEngagement = async (
	userId: string,
	guildId: string,
	pointsToAdd: number
) => {
	try {
		const updatedUGM = await updateDiscordUserPointsOnEngagement(
			userId,
			guildId,
			pointsToAdd
		);
		return updatedUGM;
	} catch (e) {
		console.error(e);
		return null;
	}
};