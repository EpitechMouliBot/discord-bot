import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';
import { checkNewTestForEveryUsers } from './check_new_tests.js';
const token = process.env.DISCORD_BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', async function() {
	const channel = await client.channels.fetch("974418168569274409");
	checkNewTestForEveryUsers(client)
});

client.login(token);
