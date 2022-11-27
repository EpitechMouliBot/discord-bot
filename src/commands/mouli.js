import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens } from '../global.js';
import { executeBDDApiRequest } from '../get_api.js';
import { sendNotification } from '../notification.js';

function get_last_testRunId(data) {
    if (data.length < 1)
        return (0);
    const lastTest = data.slice(-1)[0];
    const testRunId = lastTest['results']['testRunId'];
    return (testRunId);
}

async function sendLastMouli(interaction, mouliOffset) {
    const id = tokens[interaction.user.id].id;
    const email = tokens[interaction.user.id].email;

    // await interaction.reply({ content: `Command not yet supported` });

    executeBDDApiRequest('GET', `/${email}/epitest/me/2021`).then(async (response) => {
        if (response.status === 200) {
            const testRunId = get_last_testRunId(response.data);
            const userInfo = {
                channel_id: interaction.channelId
            }
            sendNotification(interaction.client, userInfo, response.data.slice(mouliOffset)[0], testRunId); //TODO recoder la fonction
        } else {
            let messageRes = `Error ${response.status} when sending request: ${response.statusText}`;
            console.log(messageRes);
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
