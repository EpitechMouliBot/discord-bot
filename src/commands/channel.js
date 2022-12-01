import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v10';
import { tokens, errorHandlingTokens } from '../utils/global.js';
import { executeDBRequest } from '../utils/api.js';
import * as log from '../log/log.js';

async function setChannelIdInDb(interaction, channelId) {
    if (!errorHandlingTokens(interaction)) return;
    const id = tokens[interaction.user.id].id;
    const token = tokens[interaction.user.id].token;

    executeDBRequest('PUT', `/user/id/${id}`, token, {
        "channel_id": channelId
    }).then(async (response) => {
        if (response.status === 200) {
            await interaction.reply({ content: `Channel successfully defined to <#${channelId}>`, ephemeral: true });
        } else {
            let messageRes = `Error ${response.status} when sending request: ${response.statusText}`;
            log.error(messageRes);
            await interaction.reply({ content: messageRes, ephemeral: true });
        }
    }).catch(async (error) => {
        if (error.code === 'ERR_BAD_REQUEST') {
            await interaction.reply({ content: `Error while trying to set command, please \`/login\` and retry`, ephemeral: true });
        } else {
            await interaction.reply({ content: `Error while trying to set command`, ephemeral: true });
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
