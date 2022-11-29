import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens } from '../utils/global.js';
import { setNotificationEmbed } from '../utils/notification.js';
import { executeRelayRequest, getLast_testRunId } from '../utils/relay.js';
import * as log from '../log/log.js';

async function sendLastMouli(interaction, mouliOffset) {
    if (!tokens.hasOwnProperty(interaction.user.id)) {
        await interaction.reply({ content: `You are not logged in, please /login and retry`, ephemeral: true });
        return;
    }
    const email = tokens[interaction.user.id].email;

    executeRelayRequest('GET', `/${email}/epitest/me/2021`).then(async (response) => {
        if (response.status === 200) {
            const testRunId = getLast_testRunId(response.data);
            const embed = setNotificationEmbed(response.data.slice(mouliOffset)[0], testRunId);
            interaction.reply({embeds: embed['embed'], files: embed['files']})
        } else {
            let messageRes = `Error ${response.status} when sending request: ${response.statusText}`;
            log.error(messageRes);
            await interaction.reply({ content: messageRes, ephemeral: true });
        }
    }).catch(async (error) => {
        if (error.code === 'ECONNREFUSED') {
            await interaction.reply({ content: `Error while trying to get mouli`, ephemeral: true });
        } else {
            await interaction.reply({ content: `Error while trying to get mouli, please /login and retry`, ephemeral: true });
        }
        log.error(error.message);
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
