import { SlashCommandBuilder } from 'discord.js'
import * as stats from '../stats.js'

export const data = new SlashCommandBuilder()
    .setName('leaders')
    .setDescription('Gets the top 5 players for a given stat')
    .addStringOption(option => 
        option.setName('stat')
        .setDescription('The stat to check')
        .setRequired(true)
        .addChoices(...stats.types)
    );

export async function execute(interaction) {
    try {
        const currentYear = new Date().getFullYear();
        const stat = interaction.options.getString('stat');
        const statData = stat.split(' ');
        let players = [];
        let message = `**${statData[0]}**`;
        let requests = [];
        await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentYear}/types/2/leaders`)
            .then(async (response) => await response.json())
            .then((obj) => {
                players = obj['categories'][statData[1]]['leaders'].slice(0, 5)
            });

        players.forEach(player => requests.push(fetch(`${player['athlete']['$ref']}`).then(resp => resp.json())));

        Promise.all([requests[0], requests[1], requests[2], requests[3], requests[4]])
            .then((resp) => {
                let counter = 0;
                resp.forEach(obj => {
                    message += `\n#${counter+1} ${obj['fullName']}: ${players[counter]['value']}`
                    counter++;
                })
            })
            .then(() => interaction.reply(message));
    }
    catch (error) {
        console.log(error);
    }
}