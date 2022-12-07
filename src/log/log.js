import { Colors } from './colors.js';
import dateFormat from "dateformat";
import * as fs from 'fs';

const col = new Colors();

export function reset_log_file() {
    const logFile = `./logs/latest.log`;
    if (!fs.existsSync(logFile)) return;
    let date = new Date().toLocaleString();
    date = dateFormat(date, "yyyy-mm-dd_HH-MM-ss");
    fs.renameSync(logFile, `./logs/${date}.log`);
}

function createLogFolder() {
    const dir = './logs';
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
}

async function write_in_file(message) {
    const filePath = './logs/latest.log';
    createLogFolder();
    fs.appendFileSync(filePath, message + '\n');
}

function print_color(color, message) {
    console.log(`${color}${message}${col.RESET}`);
}

function getCurrentDate() {
    const date = new Date().toLocaleString();
    return dateFormat(date, "dd/mm/yyyy HH:MM:ss");
}

function getCallFile(fromGlobalFunction) {
    let num = fromGlobalFunction ? 5 : 4;
    return (new Error()).stack.split("\n")[num].trim().split("discord-bot/")[1].split(')')[0];
}

function formatMessageText(type, message, fromGlobalFunction) {
    const date = getCurrentDate();
    type = `[${type}]`;
    return `${date.padEnd(21)}${type.padEnd(11)}${getCallFile(fromGlobalFunction).padEnd(40)}${message}`;
}

export function log(message, showInConsole = true, fromGlobalFunction = false) {
    message = formatMessageText(`LOG`, message, fromGlobalFunction);
    write_in_file(message);
    if (showInConsole)
        console.log(message);
}
export function info(message, showInConsole = true, fromGlobalFunction = false) {
    message = formatMessageText(`INFO`, message, fromGlobalFunction);
    write_in_file(message);
    if (showInConsole)
        print_color(col.BOLD_BLUE, message);
}
export function debug(message, showInConsole = true, fromGlobalFunction = false) {
    message = formatMessageText(`DEBUG`, message, fromGlobalFunction);
    write_in_file(message);
    if (showInConsole)
        print_color(col.BOLD_BLACK, message);
}
export function success(message, showInConsole = true, fromGlobalFunction = false) {
    message = formatMessageText(`SUCCESS`, message, fromGlobalFunction);
    write_in_file(message);
    if (showInConsole)
        print_color(col.BOLD_GREEN, message);
}
export function warning(message, showInConsole = true, fromGlobalFunction = false) {
    message = formatMessageText(`WARN`, message, fromGlobalFunction);
    write_in_file(message);
    if (showInConsole)
        print_color(col.BOLD_YELLOW, message);
}
export function error(message, showInConsole = true, fromGlobalFunction = false) {
    message = formatMessageText(`ERROR`, message, fromGlobalFunction);
    write_in_file(message);
    if (showInConsole)
        print_color(col.BOLD_RED, message);
}
export function critical(message, showInConsole = true, fromGlobalFunction = false) {
    message = formatMessageText(`CRIT`, message, fromGlobalFunction);
    write_in_file(message);
    if (showInConsole)
        print_color(col.BOLD_PURPLE, message);
}
