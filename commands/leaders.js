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

function parseTeams(teamNo, allTeams) {
    let team = '';
    allTeams.forEach(at => {
        if (at.value.includes(' ' + teamNo + ' ')) {
            let value = at.value.split(' ');
            team = `${value[0]} ${value[2]}`;
        }
    })
    return team;
}

export async function execute(interaction, allTeams) {
    try {
        const currentYear = new Date().getFullYear();
        const teamApiCall = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentYear}/teams/`;
        const stat = interaction.options.getString('stat');
        const statData = stat.split(' ');
        let players = [];
        let message = `**${statData[0]}**`;
        let requests = [];
        const currentMonth = new Date().getMonth();
        let seasonType = 0;

        if (currentMonth >= 1) {
            seasonType = 3;
        }
        if (currentMonth >= 2) {
            seasonType = 4;
        }
        if (currentMonth == 7) {
            seasonType = 1;
        }
        if (currentMonth >= 8) {
            seasonType = 2;
        }

        await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentYear}/types/${seasonType}/leaders`)
            .then(async (response) => await response.json())
            .then((obj) => {
                players = obj['categories'][statData[1]]['leaders'].slice(0, 5)
            });
            
        players.forEach(player => requests.push(fetch(`${player['athlete']['$ref']}`).then(resp => resp.json())));

        Promise.all(requests)
            .then((resp) => {
                let counter = 0;
                resp.forEach(obj => {
                    let teamEndpoint = obj['team']['$ref'];
                    teamEndpoint = teamEndpoint.replace(teamApiCall, '');
                    teamEndpoint = teamEndpoint.replace('?lang=en&region=us', '')
                    let teamNameLogo = parseTeams(teamEndpoint, allTeams)

                    message += `\n**#${counter+1}** ${obj['fullName']} - ${teamNameLogo}   **:**   **${players[counter]['value']}**`
                    counter++;
                })
            })
            .then(() => interaction.reply(message));
    }
    catch (error) {
        interaction.reply('Something went wrong. Anyways go birds');
        console.log(error);
    }
}