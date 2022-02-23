def get_format_date(date:str):
    date_one = date.split("T")
    date_two = str(date_one[1]).split("Z")
    return ((date_two[0] + ' ' + date_one[0]).replace('"', ""))

def get_Items(rsp_externalItems):
    bool = 0
    externalItems = ""
    for x in rsp_externalItems:
        x = x['type']
        if (x == "make-error"):
            externalItems = "Build error "
            bool = 1
        if (x == "coding-style-fail"):
            externalItems += "Too many style errors "
            bool = 1
        if (x == "banned"):
            externalItems += "Banned function used "
            bool = 1
        if (x == "crash"):
            externalItems += "Crash "
            bool = 1
        if (x == "delivery-error"):
            externalItems += "Delivery error "
            bool = 1
        if (x == "no-test-passed"):
            externalItems += "No tests passed "
            bool = 1
        if (bool == 0):
            externalItems = "Prerequisites met"
    return (externalItems)

def get_codingStyle(rsp_externalItems):
    value = ""
    for x in rsp_externalItems:
        r = x['type']
        if (r == 'lint.major'):
            value += "Major [" + str(round(x['value'])) + "] | "
        if (r == 'lint.minor'):
            value += "Minor [" + str(round(x['value'])) + "] | "
        if (r == 'lint.info'):
            value += "Info [" + str(round(x['value'])) + "]"
    return (value)

def get_Coverage(rsp_externalItems):
    value = ""
    for x in rsp_externalItems:
        r = x['type']
        if (r == 'coverage.branches'):
            value += "Branches [" + str(round(x['value'], 2)) + "] | "
        if (r == 'coverage.lines'):
            value += "Lines [" + str(round(x['value'], 2)) + "]"
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
    percents = "[" + str(round(percts, 2)) + "%]"
    return (percents)
