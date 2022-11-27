import fs from 'node:fs';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as log from './log/log.js';

export async function initCommands(client) {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        const commandOBj = await import(filePath);
        const command = commandOBj.command;

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            log.info(`Added command ${command.data.name}`);
        } else {
            log.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
