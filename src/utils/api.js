import axios from 'axios';

export async function executeDBRequest(method, endpoint, token = "", body = {}) {
    return axios({
        method: method,
        url: process.env.API_DB_HOST + endpoint,
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        data: body
    });
}
