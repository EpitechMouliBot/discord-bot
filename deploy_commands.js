import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes } from 'discord.js';
import * as fs from 'node:fs';
import { loadConfigJson } from './src/utils/global.js';
import * as log from './src/log/log.js';

const config = await loadConfigJson();

log.info(config.dev ? `Using dev mode` : `Using final mode`);

const token = config.dev ? process.env.DEV_DISCORD_BOT_TOKEN : process.env.FINAL_DISCORD_BOT_TOKEN;
const clientId = config.dev ? config.dev_client_id : config.final_client_id;
const guildId = config.dev ? config.dev_server_id : "";

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`./src/commands/${file}`);
	commands.push(command.command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		log.info(`Started refreshing ${commands.length} application (/) commands.`);

		const data = config.dev ?
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			) : await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

		log.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		log.error(error.message);
	}
})();
