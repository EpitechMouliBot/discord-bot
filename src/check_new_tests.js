import {getOkStatusOnAPI, set_testRunID_onAPI} from './get_api.js';
import {getRelayApiRequest} from './get_relay.js';
import {sendNotification} from './notification.js';
import * as log from './log/log.js';

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
        const userList = await getOkStatusOnAPI();
        if (userList == undefined) {
            log.warning("User list not found");
            continue;
        }
		for (let i = 0; i < userList.length; i++) {
            // for (let i = 0; i < 1; i++) {
			const userInfo = userList[i];
            const rspRelay = await getRelayApiRequest(userInfo['email']);
            const testRunId = await getLast_testRunId(rspRelay);
			if (testRunId != 0 && testRunId != userInfo.last_testRunId) {
				set_testRunID_onAPI(userInfo.id);
                sendNotification(client, userInfo, rspRelay.slice(-1)[0], testRunId);
			}
		}
        await asyncFunction(60000);
    }
}
