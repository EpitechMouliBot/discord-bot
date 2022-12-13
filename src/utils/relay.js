import axios from 'axios';
import { sendError } from './global.js';

export function executeRelayRequest(method, endpoint) {
    return axios({
        method: method,
        url: process.env.RELAY_HOST + endpoint,
    });
}

export function getLast_testRunId(rspRelay) {
    if (rspRelay.length < 1)
        return (0);
    const lastTest = rspRelay.slice(-1)[0];
    const testRunId = lastTest['results']['testRunId'];
    return (testRunId);
}
