import { Colors } from './colors.js';

const col = new Colors();

export function reset_log_file() {
    //TODO
}

async function write_in_file() {
    //TODO
}

function print_color(color, message) {
    console.log(`${color}${message}${col.RESET}`);
}

export function info(message) {
    const date = new Date().toLocaleString();
    const type = `[INFO]`;
    const res = `${date.padEnd(25)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_BLUE, res);
}
export function debug(message) {
    const date = new Date().toLocaleString();
    const type = `[DEBUG]`;
    const res = `${date.padEnd(25)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_BLACK, res);
}
export function success(message) {
    const date = new Date().toLocaleString();
    const type = `[SUCCESS]`;
    const res = `${date.padEnd(25)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_GREEN, res);
}
export function warning(message) {
    const date = new Date().toLocaleString();
    const type = `[WARN]`;
    const res = `${date.padEnd(25)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_YELLOW, res);
}
export function error(message) {
    const date = new Date().toLocaleString();
    const type = `[ERROR]`;
    const res = `${date.padEnd(25)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_RED, res);
}
export function critical(message) {
    const date = new Date().toLocaleString();
    const type = `[CRIT]`;
    const res = `${date.padEnd(25)}${type.padEnd(11)}${message}`;
    write_in_file(res);
    print_color(col.BOLD_PURPLE, res);
}

// info("oui");
// debug("oui");
// success("oui");
// warning("oui");
// error("oui");
// critical("oui");
