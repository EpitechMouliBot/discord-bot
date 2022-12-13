import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens, errorHandlingTokens, loadConfigJson, sendError } from '../utils/global.js';
import { executeDBRequest } from '../utils/api.js';
import dateFormat from "dateformat";
import * as log from '../log/log.js';

const config = await loadConfigJson();

function createEmbed(userInfos) {
    const embed = new EmbedBuilder()
    .setTitle('Your account')
    .addFields(
        { name: 'Email', value: userInfos.email, inline: false },
        { name: 'Discord channel id', value: userInfos.channel_id, inline: true },
        { name: 'Epitech cookies status', value: userInfos.cookies_status, inline: true },
        { name: 'Notifications', value: (userInfos.discord_status ? 'On' : 'Off'), inline: true },
        { name: 'Created at', value: dateFormat(userInfos.created_at, "mm/dd/yyyy HH:MM:ss"), inline: true }
    )
    .setTimestamp()
    .setThumbnail('attachment://epitechmoulibot_logo.png')
    .setColor('#0149ff')
    .setFooter({ text: 'EpitechMouliBot' })
    return (embed);
}

async function sendInfos(interaction) {
    if (!await errorHandlingTokens(interaction)) return;
    const id = tokens[interaction.user.id].id;
    const token = tokens[interaction.user.id].token;

    executeDBRequest('GET', `/user/id/${id}`, token).then(async (response) => {
        if (response.status === 200) {
            const embed = createEmbed(response.data);
            const thumbnailImage = new AttachmentBuilder('./images/epitechmoulibot_logo.png');
            await interaction.reply({embeds: [embed], files: [thumbnailImage], ephemeral: true });
        }
    }).catch(async (error) => {
        if (!error.response) {
            sendError(error);
            await interaction.reply({ content: `Failed to get infos, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
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
                    await interaction.reply({ content: `Error while trying to get infos, please \`/login\` and retry`, ephemeral: true });
            }
        }
    });
}

export let command = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription("Get your account's infos"),
	async execute(interaction) {
        await sendInfos(interaction);
	},
};
