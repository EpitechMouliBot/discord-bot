import discord
from datetime import datetime, timezone

def set_embed(name_project, field1, field2, color_embed, percents, message, items):
    embed = discord.Embed(
        title = "New mouli | " + name_project,
        color = color_embed
    )
    embed.add_field(name = items, value = message, inline = False)
    embed.add_field(name = "Pourcentage", value = percents, inline = False)
    embed.add_field(name = "Norme error", value = field1, inline = True)
    embed.add_field(name = "Coverage", value = field2, inline = True)
    embed.set_thumbnail(url = "https://www.epitech.bj/wp-content/uploads/2020/03/EPI-LOGO-SIGNATURE-2018.png")
    embed.set_footer(text = "my.epitech.eu |", icon_url = "https://my.epitech.eu/favicon.png")
    embed.timestamp = datetime.now(timezone.utc)
    return (embed)
