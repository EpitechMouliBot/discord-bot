// import {getOkStatusOnAPI, set_testRunID_onAPI} from './get_api.js';
import { getOkStatusOnAPI } from './get_api.js';
import {getRelayApiRequest} from './get_relay.js';
// import {sendNotification} from './notification.js';

const asyncFunction = (t) => new Promise(resolve => setTimeout(resolve, t));

async function getLast_testRunId(rspRelay) {
    const lastTest = rspRelay.slice(-1)[0];
    const testRunId = lastTest['results']['testRunId'];
    return (testRunId);
}

async function checkNewTestForEveryUsers(client) {
	while (true) {
        const userList = await getOkStatusOnAPI();
		for (let i = 0; i < 1; i++) {
			const userInfo = userList[i];
            const rspRelay = await getRelayApiRequest(userInfo['email']);
            const testRunId = await getLast_testRunId(rspRelay);
			console.log(rspRelay.slice(-1)[0]['project']['module']['code']);
			// if (testRunId != userInfo.last_testRunId) {
			// 	// set_testRunID_onAPI(userInfo.id);
            //     sendNotification(client, userInfo, rspRelay.slice(-1)[0], testRunId);
			// }
		}
        await asyncFunction(60000);
    }
}
(async () => {
    await checkNewTestForEveryUsers();
})();