import requests
from notification import send_notification
from discord.ext import tasks
from manage_json import f_get_testRunId, f_set_testRunId

@tasks.loop(seconds = 5)
async def check_new_mouli(client):
    req = requests.get("http://localhost:4634/epitest/me/2021")
    last_project = req.json()[-1]
    result = last_project["results"]
    new_testRunId = result['testRunId']
    last_testRunId = f_get_testRunId()
    if (new_testRunId != last_testRunId):
        f_set_testRunId(new_testRunId)
        send_notification(last_project, result)
