import asyncio
import requests
from notification import set_notificationPrivate, set_notificationPublic
from discord.ext import tasks
from manage_json import f_get_testRunId, f_set_testRunId

@tasks.loop(seconds = 60)
async def check_new_mouli(client):
    port = ['4634', '4635']
    for x in port:
        link_req = "http://localhost:" + x + "/epitest/me/2021"
        req = requests.get(link_req)
        last_project = req.json()[-1]
        result = last_project["results"]
        new_testRunId = result['testRunId']
        last_testRunId = f_get_testRunId(x)
        if (new_testRunId != last_testRunId):
            f_set_testRunId(new_testRunId, x)
            # if (x == '4634'):
            #     asyncio.create_task(send_notifPublic(client, last_project, result))
            embed = set_notificationPrivate(last_project, result, new_testRunId)
            channel = client.get_channel(931875862201106483)
            if (x == '4634'):
                user = "<@!419926802366988292>"
            elif (x == '4635'):
                user = "<@!617422693008146443>"
            else:
                user = "None"
            await channel.send(user + " New mouli !\n", embed=embed)

async def send_notifPublic(client, last_project, result):
    embed = set_notificationPublic(last_project, result)
    channel = client.get_channel(947832675236982794)
    user = "<@&947968565905068062>"
    await channel.send(user + " New mouli !\n", embed=embed)
