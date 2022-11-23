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

export async function sendNotification(client, userInfo, testRunInfo, testRunId) {
    try {
        const channel = await client.channels.fetch(userInfo['channel_id']);
        let title = testRunInfo['project']['name'];
        let percentPassed = calculateSkillsPercent(testRunInfo['results']['skills']);
        title += ' | ' + percentPassed.toString() + '%]';
        const description = formatDate(testRunInfo['date']);
        const statusContent = getCompleteStatus(testRunInfo['results']['externalItems']);
        const normeContent = getCompleteNorme(testRunInfo['results']['externalItems']);
        const testUrl = getCompleteUrl(testRunInfo['project']['module']['code'], testRunInfo['project']['slug'], testRunId);
        const color = getAdaptiveColor(percentPassed);
        const notificationEmbed = createEmbed(title, description, statusContent, normeContent, testUrl, color);
        const thumbnailImage = new AttachmentBuilder('./images/etipek_logo.png');
        const footerImage = new AttachmentBuilder('./images/myepitech_logo.png')
        await channel.send({content:"<@577856714347511828>", embeds: [notificationEmbed], files: [thumbnailImage, footerImage]});
    } catch (error) {
        return;
    }
}
