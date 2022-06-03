import discord
from datetime import datetime, timezone

def set_embed(name_project, norme, coverage, color_embed, percents, items, date, link):
    embed = discord.Embed(
        title = name_project + " | " + percents,
        color = color_embed,
        description = date + '\n' + link
    )
    if (items != ""):
        embed.add_field(name = "Status", value = items, inline = False)
    if (norme != ""):
        embed.add_field(name = "Norme", value = norme, inline = True)
    if (coverage != ""):
        embed.add_field(name = "Coverage", value = coverage, inline = True)
    embed.set_thumbnail(url = "https://media.discordapp.net/attachments/929701838335385631/976441374339645450/etipek_little.png")
    embed.set_footer(text = "my.epitech.eu |", icon_url = "https://my.epitech.eu/favicon.png")
    embed.timestamp = datetime.now(timezone.utc)
    return (embed)
