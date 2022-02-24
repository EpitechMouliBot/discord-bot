from datetime import datetime
import discord

def get_format_date(date:str):
    new_date = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
    new_date = new_date.strftime("%d/%m/%Y %H:%M:%S")
    return (new_date)

def get_Items(rsp_externalItems):
    bool = 0
    externalItems = ""
    for x in rsp_externalItems:
        x = x['type']
        if (x == "make-error"):
            externalItems = "Build error\n"
            bool = 1
        if (x == "coding-style-fail"):
            externalItems += "Too many style errors\n"
            bool = 1
        if (x == "banned"):
            externalItems += "Banned function used\n"
            bool = 1
        if (x == "crash"):
            externalItems += "Crash\n"
            bool = 1
        if (x == "delivery-error"):
            externalItems += "Delivery error\n"
            bool = 1
        if (x == "no-test-passed"):
            externalItems += "No tests passed\n"
            bool = 1
        if (bool == 0):
            externalItems = "Prerequisites met"
    return (externalItems)

def get_codingStyle(rsp_externalItems):
    value = ""
    for x in rsp_externalItems:
        r = x['type']
        if (r == 'lint.major'):
            value += "[" + str(round(x['value'])) + "] Major\n"
        if (r == 'lint.minor'):
            value += "[" + str(round(x['value'])) + "] Minor\n"
        if (r == 'lint.info'):
            value += "[" + str(round(x['value'])) + "] Info"
    return (value)

def get_Coverage(rsp_externalItems):
    value = ""
    for x in rsp_externalItems:
        r = x['type']
        if (r == 'coverage.branches'):
            value += "[" + str(round(x['value'], 2)) + "] Branches\n"
        if (r == 'coverage.lines'):
            value += "[" + str(round(x['value'], 2)) + "] Lines"
    return (value)

def get_percent_testPassed(rsp_skills):
    count:int = 0
    passed:int = 0
    percents:str = ""
    for x in rsp_skills:
        count += rsp_skills[x]['count']
    for x in rsp_skills:
        passed += rsp_skills[x]['passed']
    percts = passed * 100 / count
    percents = round(percts, 2)
    return (percents)

def get_color(percent):
    if (float(percent) < 25):
        return discord.Color.red()
    elif (float(percent) < 75):
        return discord.Color.orange()
    else:
        return discord.Color.green()
