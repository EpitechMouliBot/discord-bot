from get_info_mouli import get_codingStyle, get_format_date, get_Items, get_percent_testPassed, get_Coverage

def send_notification(last_project, result):
    date = get_format_date(result['date'])

    rsp_externalItems = result['externalItems']
    items = get_Items(rsp_externalItems)
    coverage = get_Coverage(rsp_externalItems)
    codingStyle = get_codingStyle(rsp_externalItems)

    percents = get_percent_testPassed(result['skills'])

