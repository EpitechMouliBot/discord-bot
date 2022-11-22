import axios from 'axios';
import express from "express";
const app = express();

export async function executeBDDApiRequest(endpoint, params, method, body) {
    const rsp = await axios({
        method: method,
        url: "http://127.0.0.1:3000/" + endpoint + params,
        headers: {
            "Authorization": "Bearer " + "veuxarisassherkzbdbd",
        },
        data: body
    }).catch(e => e.response);
    if (rsp == undefined)
        return (false);
    return rsp;
}

export async function getOkStatusOnAPI() {
    const rsp = await executeBDDApiRequest("user/status/", "ok", 'GET', {});
    if (rsp == undefined)
        return (false);
    return (rsp.data);
}

export async function set_testRunID_onAPI(id) {
    const rsp = executeBDDApiRequest("user/status/", id, 'PUT', {});
    if (rsp == undefined)
        return (false);
    return (rsp.data);
}
