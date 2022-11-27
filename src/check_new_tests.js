import dotenv from 'dotenv';
dotenv.config();
import { executeBDDApiRequest } from './get_api.js';
import { getRelayApiRequest } from './get_relay.js';
import { sendNotification } from './notification.js';

const asyncFunction = (t) => new Promise(resolve => setTimeout(resolve, t));

async function getLast_testRunId(rspRelay) {
    if (rspRelay.length < 1)
        return (0);
    const lastTest = rspRelay.slice(-1)[0];
    const testRunId = lastTest['results']['testRunId'];
    return (testRunId);
}

export async function checkNewTestForEveryUsers(client) {
	while (true) {
        executeBDDApiRequest('GET', "/user/status/ok", process.env.API_DB_TOKEN).then(async (rsp) => {
            const userList = rsp.data;
            for (let i = 0; i < userList.length; i++) {
                const userInfo = userList[i];
                const rspRelay = await getRelayApiRequest(userInfo['email']);
                const testRunId = await getLast_testRunId(rspRelay);
                if (testRunId != 0 && testRunId != userInfo.last_testRunId) {
                    executeBDDApiRequest('PUT', `/user/id/${userInfo['id']}`, process.env.API_DB_TOKEN, {
                        "last_testRunId": testRunId,
                    }).catch(async (error) => {
                        console.log(error);
                    });
                    sendNotification(client, userInfo, rspRelay.slice(-1)[0], testRunId);
                }
            }
        }).catch(async (error) => {
            console.log(error);
        });
        // await asyncFunction(60000);
        await asyncFunction(8000);
    }
}
