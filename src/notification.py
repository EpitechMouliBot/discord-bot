from get_info_mouli import get_codingStyle, get_format_date, get_Items, get_percent_testPassed, get_Coverage, get_color, get_link
import discord
from lib_discord import set_embed

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

def set_notificationPublic(last_project, result):
    date = get_format_date(last_project['date'])
    color = discord.Color.green()
    link = "https://my.epitech.eu/index.html#y/2021"

    embed = set_embed(last_project['project']['name'], "", "", color, last_project['project']['module']['code'], "", date, link)
    return (embed)
