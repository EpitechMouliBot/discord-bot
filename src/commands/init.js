import fs from 'node:fs';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export async function initCommands(client) {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    // const commandsPath = path.join(__dirname, 'commands');
    const commandsPath = __dirname;
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')).filter(file => !file.includes('init'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        const commandOBj = await import(filePath);
        const command = commandOBj.command;

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
