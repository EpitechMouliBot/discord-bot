import axios from 'axios';
import { loadConfigJson } from './global.js';

const config = await loadConfigJson();

export async function executeBDDApiRequest(method, endpoint, token = "", body = {}) {
    return axios({
        method: method,
        url: config.apidb_host + endpoint,
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        data: body
    });
}
