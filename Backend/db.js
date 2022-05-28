const knex = require('knex');

const dbClient = knex({
	client: "sqlite3",
	connection: {
		filename: "./test_database.sqlite",
	},
    useNullAsDefault: true
});

const testDBInteraction = async () => {
	try {
		await dbClient("Users").insert({ guildId: "test3", userId: "noah boboah", points: 0 });
        const insertedUsers = await dbClient('Users').join('Guilds', 'Users.guildId', 'Guilds.guildId').select('*');
	} catch (e) {
		console.error(e);
	}
};
testDBInteraction();