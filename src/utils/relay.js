import axios from 'axios';
import { sendError } from './global.js';

export function executeRelayRequest(method, endpoint) {
    return axios({
        method: method,
        url: process.env.RELAY_HOST + endpoint,
    });
}

export async function getRelayRequest(userEmail, years) {
    const res = await axios({
        method: 'GET',
        url: process.env.RELAY_HOST + `/${userEmail}/epitest/me/${years}`,
    }).catch((error) => {
        sendError(error);
        return (-84);
    });
    if (res == undefined)
        return (undefined);
    return (res.data);
}

export async function getAllYears_test(userEmail, years) {
    let rspRelay = undefined;
    let yearstmp = years;
    ++years;
    while (rspRelay !== -84 && (rspRelay === undefined || rspRelay.length < 1)) {
        if (years <= yearstmp - 10)
            return (0);
        rspRelay = await getRelayRequest(userEmail, years);
        --years;
    }
    if (rspRelay === -84 || rspRelay === undefined)
        return (0);
    return (rspRelay);
}

export function getLast_testRunId(rspRelay) {
    if (rspRelay.length < 1)
        return (0);
    const lastTest = rspRelay.slice(-1)[0];
    const testRunId = lastTest['results']['testRunId'];
    return (testRunId);
}
