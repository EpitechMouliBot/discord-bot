import dotenv from 'dotenv';
dotenv.config();
import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { checkNewTestForEveryUsers } from './check_new_tests.js';
import { initCommands } from './commands/init.js';
const token = process.env.DISCORD_BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

await initCommands(client);

client.on('ready', async function() {
	checkNewTestForEveryUsers(client);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
