import { readFile } from 'fs/promises';

export let tokens = {};

export async function loadConfigJson() {
    return JSON.parse(await readFile(new URL('../../config.json', import.meta.url)));
}
