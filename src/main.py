import time
import discord
from dotenv import dotenv_values
from mouli_check import check_new_mouli
from manage_relay import check_connected_with_relay
import json

def print_pretty_json(json_data):
    print(json.dumps(json_data, indent=4, separators=(',', ': '), sort_keys=True))

link_req = "http://localhost:" + x + "/epitest/me/2021"
req = requests.get(link_req)
last_project = req.json()[-1]
print_pretty_json(last_project)
exit(0)
####################INITS_VARIABLE####################
client = discord.Client()
secrets = dotenv_values(".env")
token_discord = secrets["TOKEN_MOULI"]

######################MAIN#################################
while (check_connected_with_relay() == False):
    time.sleep(5)

@client.event
async def on_ready():
    print("Le bot est prêt !")
    check_new_mouli.start(client)
client.run(token_discord)
