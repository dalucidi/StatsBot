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

export async function execute(interaction) {
    const team = interaction.options.getString('team');
    const teamData = team.split(' ');
    let week;
    await fetch (`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2023/`)
        .then(async (response) => await response.json())
        .then((obj) => obj['type']['week']['number'])
        .then((w) => week = w);
    await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamData[1]}/schedule`)
        .then(async (response) => await response.json())
        .then((obj) => obj['events'].filter(o => o['week'].number == week))
        .then((upcoming) => upcoming.length > 0 ? interaction.reply(`Week #${week} ${upcoming[0]['name']}`) : interaction.reply(`Week #${week} is ${teamData[0]} Bye Week`) )
}