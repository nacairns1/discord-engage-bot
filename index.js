/* eslint-disable brace-style */
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, mongoosePW } = require('./config.json');
const mongoose = require('mongoose');


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));



for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

async function dbConnect() {
	try {
		mongoose.connect(mongoosePW, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		await new Promise((resolve, reject) => {
			mongoose.connection.on("open", () => {
				console.log("Connected to mongo server.");
				resolve('connected');
			});
		}).then(() => {
			console.log("Mongo + Server + Bot running");
			mongoose.connection.disconnect();
		});
		
	} catch (error){
		'error connecting to db' + error;
	} 

}

dbConnect();

// Login to Discord with your client's token

client.login(token);

module.exports = client;

