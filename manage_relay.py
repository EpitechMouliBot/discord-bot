import requests

def check_connected_with_relay():
    try:
        requests.get("http://localhost:4634/epitest/me/2021")
        return (True)
    except:
        return (False)
