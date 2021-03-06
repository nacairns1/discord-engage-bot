import { Guilds, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

// returns information about one guild
export const findGuild = async (
	guildId: string
): Promise<{ guildId: string; timeCreated: string } | null> => {
	const guild = await prisma.guilds.findFirst({
		select: { guildId: true, timeCreated: true },
		where: { guildId },
	});
	return guild;
};

// returns information about all guilds
export const findAllGuilds = async () => {
	const guilds = await prisma.guilds.findMany();
	return guilds;
};

// adds a new guild if not a duplicate and returns the new guild object. returns null if rejected.
export const addNewGuild = async (guildId: string): Promise<Guilds | null> => {
	try {
		const guild = await findGuild(guildId)
		if (guild !== null) {
			console.log(
				"duplicate detected. returning without creating a new guild..."
			);
			return guild;
		}
		const newGuild = await prisma.guilds.create({
			data: { guildId, timeCreated: dayjs().toISOString() },
		});
		return newGuild;
	} catch (e) {
		console.error(e);
		return null;
	}
};
