import requests
from notification import set_notification
from discord.ext import tasks
from manage_json import f_get_testRunId, f_set_testRunId

@tasks.loop(seconds = 60)
async def check_new_mouli(client, port):
    link_req = "http://localhost:" + port + "/epitest/me/2021"
    req = requests.get(link_req)
    last_project = req.json()[-1]
    result = last_project["results"]
    new_testRunId = result['testRunId']
    last_testRunId = f_get_testRunId()
    if (new_testRunId != last_testRunId):
        f_set_testRunId(new_testRunId)
        embed = set_notification(last_project, result, new_testRunId)
        channel = client.get_channel(931875862201106483)
        if (port == 4634):
            user = "<@!419926802366988292>"
        elif (port == 4635):
            user = "<@!617422693008146443>"
        else:
            user = "None"
        await channel.send(user + " New mouli !\n", embed=embed)
