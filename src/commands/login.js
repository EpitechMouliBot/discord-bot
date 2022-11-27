import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens } from '../global.js';
import { executeBDDApiRequest } from '../get_api.js';

function setUserIdInDb(id, token, discordUserId) {
    executeBDDApiRequest('PUT', `/user/id/${id}`, token, {
        "server_id": discordUserId //TODO changer server_id en user_id
    }).then((response) => {
    }).catch((error) => {
        console.log(error);
    });
}

async function setTokenLogin(interaction, email, password) {
    executeBDDApiRequest('POST', `/login`, "", {
        "email": email,
        "password": password
    }).then(async (response) => {
        if (response.status === 201) {
            tokens[interaction.user.id] = {
                id: response.data.id,
                token: response.data.token
            };
            setUserIdInDb(response.data.id, response.data.token, interaction.user.id);
            await interaction.reply({ content: "You're logged in! (Your connection expires in 24h)", ephemeral: true });
        } else {
            let messageRes = `Error ${response.status} when sending request: ${response.statusText}`;
            console.log(messageRes);
            await interaction.reply({ content: messageRes, ephemeral: true });
        }
        response.data;
    }).catch(async (error) => {
        console.log(error);
        await interaction.reply({ content: `Error while trying to login, please retry`, ephemeral: true });
    });
}

export let command = {
	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription('Login to your EpitechMouliBot account')
        .addStringOption(option => option
            .setName('email')
            .setDescription('The email of your account')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('password')
            .setDescription('The password of your account')
            .setRequired(true)
        ),
	async execute(interaction) {
        await setTokenLogin(interaction, interaction.options.getString('email'), interaction.options.getString('password'));
	},
};
