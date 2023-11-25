import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('weekly')
    .setDescription('Get a list of this weeks games');

function dateConversion(date) {
    return new Date(date).toLocaleString();
}

export async function execute(interaction) {
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
            resp.forEach(event => message += (`${event['name']} - ${dateConversion(event['date'])} EST\n`))
        })
        .then(() => interaction.reply(message))
}

