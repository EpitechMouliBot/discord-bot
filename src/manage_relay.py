import time
import asyncio
import requests
from discord.ext import tasks
from manage_json import f_get_listPort, f_set_status
from notification import send_alert_discord_relay

def check_connected_with_relay() -> bool:
    try:
        requests.get("http://localhost:4634/epitest/me/2021") # thomas
        requests.get("http://localhost:4635/epitest/me/2021") # martin
        return (True)
    except:
        print("Bad connexion relay")
        return (False)

def check_connexion_relay_with_x(link_req:str):
    try:
        req = requests.get(link_req)
    except requests.exceptions.ConnectionError:
        return (None)
    if (req.status_code != 200):
        return (None)
    return (req)

async def while_down_connexion(client, port:str, link_req:str) -> None:
    for i in range(5):
        time.sleep(60)
        if (check_connexion_relay_with_x(link_req) != None):
            f_set_status(port, True)
            return
    await send_alert_discord_relay(client, port)
    return

@tasks.loop(seconds = 60)
async def check_connexion_relay(client):
    list_port = f_get_listPort()
    for port_i in list_port:
        list_port_i = list_port[port_i]
        link_req = "http://localhost:" + port_i + "/epitest/me/2021"
        if (list_port_i['status'] == True):
            if (check_connexion_relay_with_x(link_req) == None):
                print("Can't connect to my.epitech.eu with port " + port_i)
                f_set_status(port_i, False)
                asyncio.create_task(while_down_connexion(client, port_i, link_req))
        else:
            if (check_connexion_relay_with_x(link_req) != None):
                f_set_status(port_i, True)
