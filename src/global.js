import { readFile } from 'fs/promises';

export let tokens = {
    '419926802366988292': {
        id: '4',
        channel_id: '974418168569274409',
        email: 'ott.thomas68@gmail.com',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQiLCJpYXQiOjE2Njk1ODQ2NzEsImV4cCI6MTY2OTY3MTA3MX0.R7VVBjoAONDdRiqczsipfqUrvWeIiNbyHkd38Yg9sPs'
    },
};

export async function loadConfigJson() {
    return JSON.parse(await readFile(new URL('../config.json', import.meta.url)));
}
