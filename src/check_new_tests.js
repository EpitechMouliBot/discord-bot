import dotenv from 'dotenv';
dotenv.config();
import { executeDBRequest } from './utils/api.js';
import { getLast_test } from './utils/relay.js';
import { setNotificationEmbed } from './utils/notification.js';
import { sendError } from './utils/global.js';

const asyncSleep = (t) => new Promise(resolve => setTimeout(resolve, t));

function millisecondToMinute(milliseconds) {
    return milliseconds / 60000;
}

function getActualYears() {
    return new Date().getFullYear();
}

async function sendNotif(client, relayData, userInfo, testRunId, last_testRunId) {
    var statusDiscord = 1;
    try {
        const channel = await client.channels.fetch(userInfo['channel_id']);
        const embed = setNotificationEmbed(relayData, testRunId);
        await channel.send({content:`<@${userInfo['user_id']}> New mouli!`, embeds: embed['embed'], files: embed['files']});
    } catch (error) {
        console.log(error)
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
    const years = getActualYears();
    let lastTest = await getLast_test(userInfo['email'], years);
    const testRunId = lastTest['results']['testRunId'];
    if (testRunId !== 0 && testRunId !== userInfo.last_testRunId && userInfo['channel_id'] !== "0")
        await sendNotif(client, lastTest, userInfo, testRunId, userInfo.last_testRunId);
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
