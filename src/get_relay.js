import axios from 'axios';
import express from "express";
const app = express();

export async function getRelayApiRequest(email) {
    const res = await axios({
        method: 'GET',
        url: "http://localhost:8090/" + email + "/epitest/me/2021",
    }).catch(e => e.response);
    if (res == undefined)
        return (false);
    return (res.data);
}
