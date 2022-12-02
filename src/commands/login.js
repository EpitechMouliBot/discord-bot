import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens, loadConfigJson } from '../utils/global.js';
import { executeDBRequest } from '../utils/api.js';
import * as log from '../log/log.js';

const config = await loadConfigJson();

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
            console.log(tokens);
            setUserIdInDb(response.data.id, response.data.token, interaction.user.id);
            await interaction.reply({ content: "You're logged in! (Your connection expires in 24h)", ephemeral: true });
        }
    }).catch(async (error) => {
        log.error(error.message);
        if (!error.response)
            await interaction.reply({ content: `Failed to login, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
        else
            switch (error.response.status) {
                case 400:
                    await interaction.reply({ content: `Bad credentials, please retry`, ephemeral: true });
                    break;
                case 500:
                    await interaction.reply({ content: `Internal server error, please report issue at <${config.repo_issues_url}> (please provide as much informations as you can)`, ephemeral: true });
                    break;
                default:
                    await interaction.reply({ content: `Error while trying to login, sorry`, ephemeral: true });
            }
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
