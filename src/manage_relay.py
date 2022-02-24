import requests

def check_connected_with_relay():
    try:
        requests.get("http://localhost:4634/epitest/me/2021") # thomas
        requests.get("http://localhost:4635/epitest/me/2021") # martin
        return (True)
    except:
        return (False)
