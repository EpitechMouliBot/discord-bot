import { Colors } from './colors.js';
import dateFormat from "dateformat";

const col = new Colors();

export function reset_log_file() {
    //TODO
}

async function write_in_file(message) {
    //TODO
}

function print_color(color, message) {
    console.log(`${color}${message}${col.RESET}`);
}

function getCurrentDate() {
    const date = new Date().toLocaleString();
    return dateFormat(date, "mm/dd/yyyy HH:MM:ss");
}

export function log(message) {
    const date = getCurrentDate();
    const type = `[LOG]`;
    const res = `${date.padEnd(21)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    console.log(res);
}
export function info(message) {
    const date = getCurrentDate();
    const type = `[INFO]`;
    const res = `${date.padEnd(21)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_BLUE, res);
}
export function debug(message) {
    const date = getCurrentDate();
    const type = `[DEBUG]`;
    const res = `${date.padEnd(21)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_BLACK, res);
}
export function success(message) {
    const date = getCurrentDate();
    const type = `[SUCCESS]`;
    const res = `${date.padEnd(21)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_GREEN, res);
}
export function warning(message) {
    const date = getCurrentDate();
    const type = `[WARN]`;
    const res = `${date.padEnd(21)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_YELLOW, res);
}
export function error(message) {
    const date = getCurrentDate();
    const type = `[ERROR]`;
    const res = `${date.padEnd(21)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_RED, res);
}
export function critical(message) {
    const date = getCurrentDate();
    const type = `[CRIT]`;
    const res = `${date.padEnd(21)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_PURPLE, res);
}

// info("oui");
// debug("oui");
// success("oui");
// warning("oui");
// error("oui");
// critical("oui");
// log("test");
