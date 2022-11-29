import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens } from '../utils/global.js';
import { executeDBRequest } from '../utils/api.js';
import * as log from '../log/log.js';

function setUserIdInDb(id, token, discordUserId) {
    executeDBRequest('PUT', `/user/id/${id}`, token, {
        "user_id": discordUserId
    }).then((response) => {
    }).catch((error) => {
        log.error(error);
    });
}

async function setTokenLogin(interaction, email, password) {
    executeDBRequest('POST', `/login`, "", {
        "email": email,
        "password": password
    }).then(async (response) => {
        if (response.status === 201) {
            tokens[interaction.user.id] = {
                id: response.data.id,
                email: email,
                token: response.data.token
            };
            setUserIdInDb(response.data.id, response.data.token, interaction.user.id);
            await interaction.reply({ content: "You're logged in! (Your connection expires in 24h)", ephemeral: true });
        } else {
            let messageRes = `Error ${response.status} when sending request: ${response.statusText}`;
            log.error(messageRes);
            await interaction.reply({ content: messageRes, ephemeral: true });
        }
        response.data;
    }).catch(async (error) => {
        log.error(error.message);
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
