import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v10';
import { tokens, initRequest, loadConfigJson } from '../global.js';

const config = await loadConfigJson();

async function setChannelIdInDb(interaction, channelId) {
    const id = tokens[interaction.user.id].id;
    const token = tokens[interaction.user.id].token;

    initRequest('PUT', `${config.apidb_host}/user/id/${id}`, token, {
        "channel_id": channelId
    }).then(async (response) => {
        if (response.status === 200) {
            await interaction.reply({ content: `Channel successfully defined to <#${channelId}>`, ephemeral: true });
        } else {
            let messageRes = `Error ${response.status} when sending request: ${response.statusText}`;
            console.log(messageRes);
            await interaction.reply({ content: messageRes, ephemeral: true });
        }
    }).catch(async (error) => {
        console.log(error);
        await interaction.reply({ content: `Error while trying to set command, please retry`, ephemeral: true });
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
