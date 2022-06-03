from lib_discord import set_embed
from get_info_mouli import get_codingStyle, get_format_date, get_Items, get_percent_testPassed, get_Coverage, get_color, get_link

def set_notificationPrivate(last_project, result, new_testRunId):
    date = get_format_date(last_project['date'])
    rsp_externalItems = result['externalItems']
    items = get_Items(rsp_externalItems)
    coverage = get_Coverage(rsp_externalItems)
    norme = get_codingStyle(rsp_externalItems)
    percents = get_percent_testPassed(result['skills'])
    color = get_color(percents)
    link = get_link(last_project, new_testRunId)
    percents = "[" + str(percents) + "%]"
    embed = set_embed(last_project['project']['name'], norme, coverage, color, percents, items, date, link)
    return (embed)

async def send_alert_discord_relay(client, port:str):
    channel = client.get_channel(931875862201106483)
    if (port == '4634'):
        user = "<@!419926802366988292>"
    elif (port == '4635'):
        user = "<@!617422693008146443>"
    else:
        user = "None"
    message = "Your cookie.json is expired, please do it again to reactivate your notifications."
    await channel.send(user + "| cookie.json expired !\n" + message)