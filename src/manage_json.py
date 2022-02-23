import json

def print_pretty_json(json_data):
    print(json.dumps(json_data, indent=4, separators=(',', ': '), sort_keys=True))

def f_get_testRunId():
    with open("data.json", "r") as file:
        data = json.load(file)
    return(data['testRunId'])

def f_set_testRunId(testRunId:int):
    with open("data.json", 'r') as file:
        data = json.load(file)
    data['testRunId'] = testRunId
    with open("data.json", 'w') as file:
        json.dump(data, file, indent = 4)
