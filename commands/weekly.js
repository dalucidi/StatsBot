import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('weekly')
    .setDescription('Get a list of this weeks games');

function dateConversion(date) {
    return new Date(date).toLocaleString();
}

function parseTeams(teams, allTeams) {
    let teamSplit = teams.split(' at ');
    let teamNames = [];
    teamSplit.forEach(ts => {
        let nameHolder = ts.split(' ');
        teamNames.push(nameHolder[nameHolder.length - 1]);
    })
    let logos = [];
    teamNames.forEach(team => {
        let value = allTeams.filter(at => at.name == team);
        let splitName = value[0].value.split(' ');
        logos.push(splitName[2]);
    })

    return logos;
}

export async function execute(interaction, allTeams) {
    try {
        let eventEndpoints = [];
        let message = '';
        await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events')
        .then(response => response.json())
        .then(obj => obj['items'])
        .then(allEventsJson => {
            allEventsJson.forEach(event => eventEndpoints.push(fetch(`${event['$ref']}`).then(resp => resp.json())))
        })

        Promise.all(eventEndpoints)
            .then((resp) => {
                //Sort the events because in the case I tested, one of the games was out of order
                resp.sort(function(a,b){
                    return new Date(a['date']) - new Date(b['date']);
                });
                resp.forEach(event => {
                    let logos = parseTeams(event['name'], allTeams)
                    message += (`${logos[0]} ${event['name']} ${logos[1]} - ${dateConversion(event['date'])} EST\n`)
                })
            })
            .then(() => interaction.reply(message))
    } 
    catch (error) {
        interaction.reply('Something went wrong. Anyways go birds');
        console.log(error);
    }
}

