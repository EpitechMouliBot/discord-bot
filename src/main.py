#!/usr/bin/python

import time
import discord
from dotenv import dotenv_values
from mouli_check import check_new_mouli
from manage_json import check_exist_file
from manage_relay import check_connected_with_relay, check_connexion_relay

####################INITS_VARIABLE####################
client = discord.Client()
secrets = dotenv_values(".env")
token_discord = secrets["TOKEN_MOULI"]
pwd_data = secrets["PWD_DATA"]

######################MAIN#################################
while (check_connected_with_relay() == False or check_exist_file(pwd_data) is False):
    time.sleep(5)

@client.event
async def on_ready():
    print("Le bot est prêt !")
    check_new_mouli.start(client, pwd_data)
    check_connexion_relay.start(client)
client.run(token_discord)
