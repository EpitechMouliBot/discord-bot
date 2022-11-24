import axios from 'axios';

export let tokens = {
    '617422693008146443': {
        id: '1',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2NjkzMTQwNjcsImV4cCI6MTY2OTQwMDQ2N30.hGsqZfhre_MgIltjh_bFqrPfvtF1qQqfgpSxrNSWM3o'
    }
};

export function initRequest(method, url, token = "", body = {}) {
    return axios({
        method: method,
        url: url,
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        data: body
    });
}
