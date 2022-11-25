import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes } from 'discord.js';
import * as fs from 'node:fs';
import { loadConfigJson } from './src/global.js';

const config = await loadConfigJson();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = config.dev ? config.dev_client_id : config.final_client_id;
const guildId = config.dev ? config.dev_server_id : 0;

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
			config.dev ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId),

			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
