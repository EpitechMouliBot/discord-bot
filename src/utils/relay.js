import axios from 'axios';
import { loadConfigJson } from './global.js';

const config = await loadConfigJson();

export function executeRelayRequest(method, endpoint) {
    return axios({
        method: method,
        url: config.relay_host + endpoint,
    });
}

export function getLast_testRunId(rspRelay) {
    if (rspRelay.length < 1)
        return (0);
    const lastTest = rspRelay.slice(-1)[0];
    const testRunId = lastTest['results']['testRunId'];
    return (testRunId);
}
