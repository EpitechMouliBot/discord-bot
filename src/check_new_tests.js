import dotenv from 'dotenv';
dotenv.config();
import { executeDBRequest } from './utils/api.js';
import { executeRelayRequest, getLast_testRunId } from './utils/relay.js';
import { setNotificationEmbed } from './utils/notification.js';
import * as log from './log/log.js';

const asyncSleep = (t) => new Promise(resolve => setTimeout(resolve, t));

async function sendNotif(client, relayData, userInfo, testRunId) {
    try {
        const embed = setNotificationEmbed(relayData.slice(-1)[0], testRunId);
        const channel = await client.channels.fetch(userInfo['channel_id']);
        await channel.send({content:`<@${userInfo['user_id']}>`, embeds: embed['embed'], files: embed['files']});
        executeDBRequest('PUT', `/user/id/${userInfo['id']}`, process.env.API_DB_TOKEN, {
            "last_testRunId": testRunId,
        }).catch((error) => {
            log.error(error.message);
        });
    } catch (error) {
        log.error(error.message);
    }
}

async function checkForOneUser(client, userInfo) {
    executeRelayRequest('GET', `/${userInfo['email']}/epitest/me/2021`).then(async (rsp) => {
        const relayData = rsp.data;
        const testRunId = getLast_testRunId(relayData);
        if (testRunId !== 0 && testRunId !== userInfo.last_testRunId && userInfo['channel_id'] !== "0") {
            try {
                await sendNotif(client, relayData, userInfo, testRunId);
            } catch (error) {
                log.error(error.message);
            }
        }
    }).catch((error) => {
        log.error(error.message);
    });
}

export async function checkNewTestForEveryUsers(client) {
	while (true) {
        try {
            executeDBRequest('GET', "/user/status/ok", process.env.API_DB_TOKEN).then(async (rsp) => {
                const userList = rsp.data;
                for (let i = 0; i < userList.length; i++)
                    await checkForOneUser(client, userList[i]);
            }).catch(async (error) => {
                log.error(error.message);
            });
        } catch (error) {
            log.error(error.message);
        }
        await asyncSleep(60000);
    }
}
