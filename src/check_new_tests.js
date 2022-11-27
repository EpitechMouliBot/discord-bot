import dotenv from 'dotenv';
dotenv.config();
import { executeBDDApiRequest } from './get_api.js';
import { executeRelayApiRequest, getLast_testRunId } from './get_relay.js';
import { sendNotification } from './notification.js';

const asyncFunction = (t) => new Promise(resolve => setTimeout(resolve, t));

export async function checkNewTestForEveryUsers(client) {
	while (true) {
        executeBDDApiRequest('GET', "/user/status/ok", process.env.API_DB_TOKEN).then(async (rsp) => {
            const userList = rsp.data;
            for (let i = 0; i < userList.length; i++) {
                const userInfo = userList[i];
                const rspRelay1 = await executeRelayApiRequest('GET', `/${userInfo['email']}/epitest/me/2021`);
                const rspRelay = rspRelay1.data;
                const testRunId = await getLast_testRunId(rspRelay);
                if (testRunId != 0 && testRunId != userInfo.last_testRunId) {
                    executeBDDApiRequest('PUT', `/user/id/${userInfo['id']}`, process.env.API_DB_TOKEN, {
                        "last_testRunId": testRunId,
                    }).catch(async (error) => {
                        console.log(error);
                    });
                    sendNotification(client, userInfo['user_id'], userInfo['channel_id'], rspRelay.slice(-1)[0], testRunId);
                }
            }
        }).catch(async (error) => {
            console.log(error);
        });
        // await asyncFunction(60000);
        await asyncFunction(8000);
    }
}
