import dotenv from 'dotenv';
dotenv.config();
import { executeDBRequest } from './utils/api.js';
import { executeRelayRequest, getLast_testRunId } from './utils/relay.js';
import { setNotificationEmbed } from './utils/notification.js';
import { sendError } from './utils/global.js';

const asyncSleep = (t) => new Promise(resolve => setTimeout(resolve, t));

function millisecondToMinute(milliseconds) {
    return milliseconds / 60000;
}

async function sendNotif(client, relayData, userInfo, testRunId, last_testRunId) {
    var statusDiscord = 1;
    try {
        const channel = await client.channels.fetch(userInfo['channel_id']);
        const embed = setNotificationEmbed(relayData.slice(-1)[0], testRunId);
        await channel.send({content:`<@${userInfo['user_id']}> New mouli!`, embeds: embed['embed'], files: embed['files']});
    } catch (error) {
        statusDiscord = 0;
    }
    if (statusDiscord === 0)
        testRunId = last_testRunId
    executeDBRequest('PUT', `/user/id/${userInfo['id']}`, process.env.API_DB_TOKEN, {
        'last_testRunId': testRunId,
        'discord_status': statusDiscord
    }).catch((error) => {
        sendError(error);
    });
    return (0);
}

async function checkForOneUser(client, userInfo) {
    if (userInfo['discord_status'] === 0)
        return;
    executeRelayRequest('GET', `/${userInfo['email']}/epitest/me/2021`).then(async (rsp) => {
        const relayData = rsp.data;
        const testRunId = getLast_testRunId(relayData);
        if (testRunId !== 0 && testRunId !== userInfo.last_testRunId && userInfo['channel_id'] !== "0")
            await sendNotif(client, relayData, userInfo, testRunId, userInfo.last_testRunId);
    }).catch((error) => {
        sendError(error);
    });
}

export async function checkNewTestForEveryUsers(client) {
    let lastCatchedError = new Date(0);

	while (true) {
        executeDBRequest('GET', "/user/status/ok", process.env.API_DB_TOKEN).then(async (rsp) => {
            const userList = rsp.data;
            for (let i = 0; i < userList.length; i++)
                await checkForOneUser(client, userList[i]);
        }).catch((error) => {
            const currentDate = new Date();
            if (millisecondToMinute(currentDate) - millisecondToMinute(lastCatchedError) >= 2)
                sendError(error);
            lastCatchedError = currentDate;
        });
        await asyncSleep(60000);
    }
}
