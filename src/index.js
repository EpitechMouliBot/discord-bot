import dotenv from 'dotenv';
dotenv.config();
import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { checkNewTestForEveryUsers } from './check_new_tests.js';
import { initCommands } from './init_commands.js';
import { loadConfigJson, sendError } from './utils/global.js';
import * as log from './log/log.js';

log.reset_log_file();

const config = await loadConfigJson();
const token = config.dev ? process.env.DEV_DISCORD_BOT_TOKEN : process.env.FINAL_DISCORD_BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

await initCommands(client);

client.on('ready', async function() {
    checkNewTestForEveryUsers(client);
    log.success(`${client.user.tag} is ready`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply({ content: `No command matching ${interaction.commandName} was found.`, ephemeral: true });
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        sendError(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);
