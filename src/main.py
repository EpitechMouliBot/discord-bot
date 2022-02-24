from discord.ext import tasks
import time
from dotenv import dotenv_values
import discord
from paramiko import Channel
from lib_discord import set_embed
from manage_json import f_set_testRunId
from mouli_check import check_new_mouli
from manage_relay import check_connected_with_relay

####################INITS_VARIABLE####################
client = discord.Client()
secrets = dotenv_values(".env")
token_discord = secrets["TOKEN_MOULI"]

f_set_testRunId(0)

######################MAIN#################################
while (check_connected_with_relay() == False):
    time.sleep(5)

@client.event
async def on_ready():
    print("Le bot est prêt !")
    # send_embed.start()
    check_new_mouli.start(client)
client.run(token_discord)
