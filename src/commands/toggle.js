import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens, errorHandlingTokens, loadConfigJson, sendError } from '../utils/global.js';
import { executeDBRequest } from '../utils/api.js';
import * as log from '../log/log.js';

const config = await loadConfigJson();

async function errorHandlingRequests(error, interaction) {
    if (!error.response) {
        sendError(error);
        await interaction.reply({ content: `Failed to toggle notifications, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
    } else {
        if (error.response.status !== 403)
            sendError(error);
        switch (error.response.status) {
            case 403:
                await interaction.reply({ content: `Authorization denied, please \`/login\` and retry`, ephemeral: true });
                break;
            case 400:
                await interaction.reply({ content: `Bad parameter, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
                break;
            case 500:
                await interaction.reply({ content: `Internal server error, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
                break;
            default:
                await interaction.reply({ content: `Error while trying to toggle notifications, please \`/login\` and retry`, ephemeral: true });
        }
    }
}

function setDiscordStatus(interaction, value, id, token) {
    executeDBRequest('PUT', `/user/id/${id}`, token, {
        "discord_status": value
    }).then(async (response) => {
        if (response.status === 200) {
            if (value === 1)
                await interaction.reply({ content: `We will now send you notifications`, ephemeral: true });
            else
                await interaction.reply({ content: `We will no longer send you notifications`, ephemeral: true });
        }
    }).catch(async (error) => {
        await errorHandlingRequests(error, interaction);
    });
}

async function checkDiscordStatus(interaction, value) {
    if (!await errorHandlingTokens(interaction)) return;
    const id = tokens[interaction.user.id].id;
    const token = tokens[interaction.user.id].token;

    executeDBRequest('GET', `/user/id/${id}`, token).then(async (response) => {
        if (response.status === 200) {
            if (response.data.channel_id !== "0")
                setDiscordStatus(interaction, value, id, token);
            else
                await interaction.reply({ content: `Please set your channel`, ephemeral: true });
        }
    }).catch(async (error) => {
        await errorHandlingRequests(error, interaction);
    });
}

export let command = {
	data: new SlashCommandBuilder()
		.setName('toggle')
		.setDescription('Enable or disable mouli notifications.')
        .addStringOption(option => option
            .setName('switch')
            .setDescription('On: enables notifications / Off: disables notifications')
            .setRequired(true)
            .addChoices(
                { name: 'On', value: '1' },
                { name: 'Off', value: '0' }
            )),
	async execute(interaction) {
        await checkDiscordStatus(interaction, parseInt(interaction.options.getString('switch')));
	},
};
