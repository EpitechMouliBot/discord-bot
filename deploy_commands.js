import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes } from 'discord.js';
import * as fs from 'node:fs';
const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENTID;
const guildId = "849609664193888267";

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`./src/commands/${file}`);
	commands.push(command.command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
//** to sync only on a guild
			Routes.applicationGuildCommands(clientId, guildId),
//** to sync on all guilds
			// Routes.applicationCommands(clientId),

			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
