import { EmbedBuilder, WebhookClient } from 'discord.js';
import { readFile } from 'fs/promises';
import * as log from 'nodejs-log-utils';

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

function sendWebhook(errorMessage) {
    if (process.env.WEBHOOK_URL === "") return;

    const embed = new EmbedBuilder()
        .setTitle('New error detected')
        .setColor(0xFF0000)
        .setDescription(errorMessage);

    try {
        const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });
        webhookClient.send({
            content: '@everyone New error detected',
            username: 'EpitechMouliBot Errors',
            embeds: [embed],
        }).catch((error) => {
            log.error(error.message);
            log.debug(JSON.stringify(error, null, 4), false);
        });
    } catch (error) {
        log.error(error.message);
        log.debug(JSON.stringify(error, null, 4), false);
    }
}

export async function sendError(errorObj) {
    log.error(errorObj.message, true, true);
    log.debug(JSON.stringify(errorObj, null, 4), false, true);
    sendWebhook(errorObj.message);
}
