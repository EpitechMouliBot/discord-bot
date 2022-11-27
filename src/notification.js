import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { formatDate, calculateSkillsPercent, getCompleteStatus,
    getCompleteNorme, getCompleteUrl, getAdaptiveColor } from './set_information.js';

function createEmbed(title, description, statusContent, normeContent, testUrl, color) {

    const notificationEmbed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .addFields(
        { name: 'Status', value: statusContent, inline: false },
        { name: 'Norme', value: normeContent, inline: false },
    )
    .setTimestamp()
    .setThumbnail('attachment://etipek_logo.png')
    .setColor(color)
    .setFooter({ text: 'my.epitech.eu', iconURL: 'attachment://myepitech_logo.png' })
    .setURL(testUrl);
    return (notificationEmbed);
}

export async function sendNotification(client, userTagID, channel_id, lastTestRunInfo, testRunId) {
    try {
        const channel = await client.channels.fetch(channel_id);
        let title = lastTestRunInfo['project']['name'];
        let percentPassed = calculateSkillsPercent(lastTestRunInfo['results']['skills']);
        title += ' | ' + percentPassed.toString() + '%]';
        const description = formatDate(lastTestRunInfo['date']);
        const statusContent = getCompleteStatus(lastTestRunInfo['results']['externalItems']);
        const normeContent = getCompleteNorme(lastTestRunInfo['results']['externalItems']);
        const testUrl = getCompleteUrl(lastTestRunInfo['project']['module']['code'], lastTestRunInfo['project']['slug'], testRunId);
        const color = getAdaptiveColor(percentPassed);
        const notificationEmbed = createEmbed(title, description, statusContent, normeContent, testUrl, color);
        const thumbnailImage = new AttachmentBuilder('./images/etipek_logo.png');
        const footerImage = new AttachmentBuilder('./images/myepitech_logo.png')
        await channel.send({content:`<@${userTagID}>`, embeds: [notificationEmbed], files: [thumbnailImage, footerImage]});
    } catch (error) {
        return;
    }
}
