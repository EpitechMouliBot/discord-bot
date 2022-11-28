import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens } from '../global.js';
import { sendNotification } from '../notification.js';
import { executeRelayApiRequest, getLast_testRunId } from '../get_relay.js'

async function sendLastMouli(interaction, mouliOffset) {
    const channel_id = tokens[interaction.user.id].channel_id;
    const email = tokens[interaction.user.id].email;

    // await interaction.reply({ content: `Command not yet supported` });

    executeRelayApiRequest('GET', `/${email}/epitest/me/2021`).then(async (response) => {
        if (response.status === 200) {
            const testRunId = await getLast_testRunId(response.data);
            sendNotification(interaction.client, interaction.user.id, channel_id, response.data.slice(mouliOffset)[0], testRunId);
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
