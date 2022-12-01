import { readFile } from 'fs/promises';

export let tokens = {};

export async function errorHandlingTokens(interaction) {
    if (!tokens.hasOwnProperty(interaction.user.id)) {
        await interaction.reply({ content: `You are not logged in, please \`/login\` and retry`, ephemeral: true });
        return false;
    }
    return true;
}

export async function loadConfigJson() {
    return JSON.parse(await readFile(new URL('../../config.json', import.meta.url)));
}
