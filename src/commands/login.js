import { SlashCommandBuilder } from '@discordjs/builders';
import { tokens } from '../global.js';
import axios from 'axios';

function initRequest(method, url, token = "", body = {}) {
    return axios({
        method: method,
        url: url,
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        data: body
    });
}

async function setTokenLogin(interaction, email, password) {
    let request = initRequest('POST', 'http://127.0.0.1:3000/login', "", {
        "email": email,
        "password": password
    });
    request.then(async (response) => {
        if (response.status === 201) {
            const userId = interaction.user.id;
            tokens[userId] = response.data.token;
            await interaction.reply({ content: "You're logged in!", ephemeral: true });
        } else {
            let messageRes = `Error ${response.status} when sending request: ${response.statusText}`;
            console.log(messageRes);
            await interaction.reply({ content: messageRes, ephemeral: true });
        }
        response.data;
    }).catch((error) => {
        console.log(error);
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
