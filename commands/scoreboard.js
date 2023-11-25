import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('scoreboard')
    .setDescription('Gets the score of a teams game today')
    .addStringOption(option => 
        option.setName('team')
        .setDescription('The team who\'s game to check')
        .setRequired(true)
        .setAutocomplete(true)
    );

function parseTeams(teams, allTeams) {
    let logos = [];
    teams.forEach(team => {
        let value = allTeams.filter(at => at.name == team);
        let splitName = value[0].value.split(' ');
        logos.push(splitName[2]);
    })

    return logos;
}

export async function execute(interaction, allTeams) {
    try {
        let dd = new Date().getDate().toString();
        if (dd < 10) dd = '0' + dd;
        const mm = new Date().getMonth() + 1;
        const yyyy = new Date().getFullYear();
        const team = interaction.options.getString('team');
        const teamData = team.split(' ');
        let events = [];
        let message = `The ${teamData[0]} aren't playing today`;
        let todaysGame;
        await fetch (`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${yyyy}${mm}${dd}`)
            .then(async (response) => await response.json())
            .then((obj) => events = obj['events'])
        
        events.forEach(event => {
            if (event['name'].includes(`${teamData[0]}`)) todaysGame = event
        })
        if (!todaysGame) {
            interaction.reply(message);
        } else {
            let competitors = todaysGame['competitions'][0]['competitors'];
            let compScore1 = parseInt(competitors[0]['score']);
            let compScore2 = parseInt(competitors[1]['score']);
            if (compScore1 > compScore2) {
                compScore1 = `**${compScore1}**`;
            } else {
                compScore2 = `**${compScore2}**`;
            }

            let logos = parseTeams([competitors[0]['team']['name'], competitors[1]['team']['name']], allTeams)

            message = `__**SCORE BOARD**__` +
            `\n${competitors[0]['team']['location']} ${competitors[0]['team']['name']}: ${compScore1} ${logos[0]}` + 
            `\n${competitors[1]['team']['location']} ${competitors[1]['team']['name']}: ${compScore2} ${logos[1]}`;

            interaction.reply(message);
        }
    }
    catch (error) {
        interaction.reply('Something went wrong. Anyways go birds');
        console.log(error);
    }
}