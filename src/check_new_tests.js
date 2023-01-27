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

async function sendNotif(client, relayData, userInfo, testRunId, last_testRunId, year) {
    var statusDiscord = 1;
    try {
        const channel = await client.channels.fetch(userInfo['channel_id']);
        const embed = setNotificationEmbed(relayData.slice(-1)[0], testRunId, year);
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

async function checkForOneUser(client, userInfo, years) {
    if (userInfo['discord_status'] === 0)
        return;

    executeRelayRequest('GET', `/${userInfo['email']}/epitest/me/${years}`).then(async (rsp) => {
        const relayData = rsp.data;
        let actualYears = new Date().getFullYear();
        if (relayData === undefined || relayData.length < 1 && years >= actualYears - 10)
            checkForOneUser(client, userInfo, years - 1);
        const testRunId = getLast_testRunId(relayData);
        if (testRunId !== 0 && testRunId !== userInfo.last_testRunId && userInfo['channel_id'] !== "0")
            await sendNotif(client, relayData, userInfo, testRunId, userInfo.last_testRunId, years);
    }).catch((error) => {
        sendError(error);
    });
}

export async function checkNewTestForEveryUsers(client) {
    let lastCatchedError = new Date(0);
    let actualYears;

	while (true) {
        actualYears = new Date().getFullYear();
        executeDBRequest('GET', "/user/status/ok", process.env.API_DB_TOKEN).then(async (rsp) => {
            const userList = rsp.data;
            for (let i = 0; i < userList.length; i++)
                await checkForOneUser(client, userList[i], actualYears);
        }).catch((error) => {
            const currentDate = new Date();
            if (millisecondToMinute(currentDate) - millisecondToMinute(lastCatchedError) >= 2)
                sendError(error);
            lastCatchedError = currentDate;
        });
        await asyncSleep(60000);
    }
}