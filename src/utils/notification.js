import { sendEmail } from './email.js';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { formatDate, calculateSkillsPercent, getCompleteStatus, getCompleteNorme, getCompleteUrl, getAdaptiveColor } from './set_information.js';

function createEmbed(title, description, statusContent, normeContent, testUrl, color) {

    const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .addFields(
        { name: 'Status', value: statusContent, inline: false },
        { name: 'Norme', value: normeContent, inline: false },
    )
    .setTimestamp()
    .setThumbnail('attachment://epitechmoulibot_logo.png')
    .setColor(color)
    .setFooter({ text: 'my.epitech.eu', iconURL: 'attachment://myepitech_logo.png' })
    .setURL(testUrl);
    return (embed);
}

export function sendNotificationEmail(toSend, lastTestRunInfo, testRunId, year) {
    sendEmail(toSend,
        calculateSkillsPercent(lastTestRunInfo['results']['skills']),
        getCompleteUrl(lastTestRunInfo['project']['module']['code'], lastTestRunInfo['project']['slug'], testRunId, year),
        lastTestRunInfo['project']['name'],
        getCompleteStatus(lastTestRunInfo['results']['externalItems']),
        getCompleteNorme(lastTestRunInfo['results']['externalItems']));
}

export function setNotificationEmbed(lastTestRunInfo, testRunId, year) {
    let title = lastTestRunInfo['project']['name'];
    let percentPassed = calculateSkillsPercent(lastTestRunInfo['results']['skills']);
    title += ' | [' + percentPassed.toString() + '%]';
    const description = formatDate(lastTestRunInfo['date']);
    const statusContent = getCompleteStatus(lastTestRunInfo['results']['externalItems']);
    const normeContent = getCompleteNorme(lastTestRunInfo['results']['externalItems']);
    const testUrl = getCompleteUrl(lastTestRunInfo['project']['module']['code'], lastTestRunInfo['project']['slug'], testRunId, year);
    const color = getAdaptiveColor(percentPassed);
    const notificationEmbed = createEmbed(title, description, statusContent, normeContent, testUrl, color);
    const thumbnailImage = new AttachmentBuilder('./images/epitechmoulibot_logo.png');
    const footerImage = new AttachmentBuilder('./images/myepitech_logo.png')
    return ({embed: [notificationEmbed], files: [thumbnailImage, footerImage]});
}
