import discord
from datetime import datetime, timezone

def set_embed(name_project, norme, coverage, color_embed, percents, items, date, link):
    embed = discord.Embed(
        title = name_project + " | " + percents,
        color = color_embed,
        description = date + '\n' + link
    )
    embed.add_field(name = "Status", value = items, inline = False)
    embed.add_field(name = "Norme", value = norme, inline = True)
    embed.add_field(name = "Coverage", value = coverage, inline = True)
    embed.set_thumbnail(url = "https://www.epitech.bj/wp-content/uploads/2020/03/EPI-LOGO-SIGNATURE-2018.png")
    embed.set_footer(text = "my.epitech.eu |", icon_url = "https://my.epitech.eu/favicon.png")
    embed.timestamp = datetime.now(timezone.utc)
    return (embed)
