import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens, errorHandlingTokens, loadConfigJson, sendError } from '../utils/global.js';
import { setNotificationEmbed } from '../utils/notification.js';
import { executeRelayRequest, getLast_testRunId } from '../utils/relay.js';
import * as log from '../log/log.js';

const config = await loadConfigJson();

async function sendLastMouli(interaction, mouliOffset) {
    if (!await errorHandlingTokens(interaction)) return;
    const email = tokens[interaction.user.id].email;

    executeRelayRequest('GET', `/${email}/epitest/me/2021`).then(async (response) => {
        if (response.status === 200) {
            const testRunId = getLast_testRunId(response.data);
            const embed = setNotificationEmbed(response.data.slice(mouliOffset)[0], testRunId);
            interaction.reply({embeds: embed['embed'], files: embed['files']})
        }
    }).catch(async (error) => {
        if (!error.response) {
            sendError(error);
            await interaction.reply({ content: `Failed to get mouli, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
        } else {
            if (error.response.status !== 403)
                sendError(error);
            switch (error.response.status) {
                case 403:
                    await interaction.reply({ content: `Authorization denied, please \`/login\` and retry`, ephemeral: true });
                    break;
                case 500:
                    await interaction.reply({ content: `Internal server error, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
                    break;
                default:
                    await interaction.reply({ content: `Error while trying to get mouli, please \`/login\` and retry`, ephemeral: true });
            }
        }
    });
}

export let command = {
	data: new SlashCommandBuilder()
		.setName('mouli')
		.setDescription('Get the last mouli check')
        .addNumberOption(option => option
            .setName('offset')
            .setDescription('The offset number of the mouli tu get (default 1)')
            .setRequired(false)
        ),
	async execute(interaction) {
        let number = interaction.options.getNumber('offset') ?? 1;
        if (number === 0)
            number = 1;
        if (number > 0)
            number *= -1;
        await sendLastMouli(interaction, number);
	}
};
