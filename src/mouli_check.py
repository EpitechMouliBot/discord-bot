from notification import set_notificationPrivate
from discord.ext import tasks
from manage_json import f_get_testRunId, f_set_testRunId, check_exist_file
from manage_relay import check_connexion_relay_with_x

@tasks.loop(seconds = 60)
async def check_new_mouli(client, pwd_data):
    port = ['4634', '4635']
    if (check_exist_file(pwd_data) is False):
        print("error: data.json isnt exist")
        return
    for x in port:
        link_req = "http://localhost:" + x + "/epitest/me/2021"
        req = check_connexion_relay_with_x(link_req)
        if (req == None):
            return
        last_project = req.json()[-1]
        result = last_project["results"]
        new_testRunId = result['testRunId']
        last_testRunId = f_get_testRunId(x)
        if (new_testRunId != last_testRunId):
            f_set_testRunId(new_testRunId, x)
            embed = set_notificationPrivate(last_project, result, new_testRunId)
            channel = client.get_channel(931875862201106483)
            if (x == '4634'):
                user = "<@!419926802366988292>"
            elif (x == '4635'):
                user = "<@!617422693008146443>"
            else:
                user = "None"
            await channel.send(user + "| New mouli !\n", embed=embed)
