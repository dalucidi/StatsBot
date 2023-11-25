import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('upcoming')
    .setDescription('Gets a teams upcoming game (i.e "PHI @ KC")')
    .addStringOption(option => 
        option.setName('team')
        .setDescription('The team who\'s upcoming game to check')
        .setRequired(true)
        .setAutocomplete(true)
    );

function dateConversion(date) {
    return new Date(date).toLocaleString();
}

function parseTeams(teams, allTeams) {
    let teamSplit = teams.split(' at ');
    let logos = [];
    allTeams.forEach(at => teamSplit.forEach(t => {
        if(t.includes(at.name)) {
            let value = at.value.split(' ')
            logos.push(value[2]);
        }
    }))
    return logos;
}

export async function execute(interaction, allTeams) {
    try {
        const currentYear = new Date().getFullYear();
        const team = interaction.options.getString('team');
        const teamData = team.split(' ');
        let week;
        await fetch (`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentYear}/`)
            .then(async (response) => await response.json())
            .then((obj) => obj['type']['week']['number'])
            .then((w) => week = w);
        await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamData[1]}/schedule`)
            .then(async (response) => await response.json())
            .then((obj) => obj['events'].filter(o => o['week'].number == week))
            .then((upcoming) => {
                let logos = parseTeams(upcoming[0]['name'], allTeams)
                upcoming.length > 0 ? interaction.reply(`Week #${week} - ${logos[0]} ${upcoming[0]['name']} ${logos[1]} - ${dateConversion(upcoming[0]['date'])} EST`) : interaction.reply(`Week #${week} is ${teamData[0]} Bye Week`) 
            })
    }
    catch (error) {
        interaction.reply('Something went wrong. Anyways go birds');
        console.log(error);
    }
}