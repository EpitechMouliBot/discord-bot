import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v10';
import { tokens, errorHandlingTokens, loadConfigJson } from '../utils/global.js';
import { executeDBRequest } from '../utils/api.js';
import * as log from '../log/log.js';

const config = await loadConfigJson();

async function setChannelIdInDb(interaction, channelId) {
    if (!await errorHandlingTokens(interaction)) return;
    const id = tokens[interaction.user.id].id;
    const token = tokens[interaction.user.id].token;

    executeDBRequest('PUT', `/user/id/${id}`, token, {
        "channel_id": channelId
    }).then(async (response) => {
        if (response.status === 200) {
            await interaction.reply({ content: `Channel successfully defined to <#${channelId}>`, ephemeral: true });
        }
    }).catch(async (error) => {
        log.error(error.message);
        if (!error.response)
            await interaction.reply({ content: `Failed to set channel, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
        else
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
                    await interaction.reply({ content: `Error while trying to set command, please \`/login\` and retry`, ephemeral: true });
            }
    });
}

export let command = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('Sets the channel where you will recieve notifications from the bot.')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel where you will recieve notifications')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
            .addChannelTypes(ChannelType.GuildAnnouncement)
        ),
	async execute(interaction) {
        await setChannelIdInDb(interaction, interaction.options.getChannel('channel').id);
	},
};
