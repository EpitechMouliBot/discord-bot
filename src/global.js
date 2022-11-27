import { readFile } from 'fs/promises';

export let tokens = {
    '617422693008146443': {
        id: '5',
        email: 'martin.lbdh@gmail.com',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2NjkzMTQwNjcsImV4cCI6MTY2OTQwMDQ2N30.hGsqZfhre_MgIltjh_bFqrPfvtF1qQqfgpSxrNSWM3o'
    },
};

export async function loadConfigJson() {
    return JSON.parse(await readFile(new URL('../config.json', import.meta.url)));
}
