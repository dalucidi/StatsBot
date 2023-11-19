import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('records')
    .setDescription('Gets the current record of a given team')
    .addStringOption(option => 
        option.setName('team')
        .setDescription('The team who\'s standing to check')
        .setRequired(true)
        .setAutocomplete(true)
    );

export async function execute(interaction) {
    const currentYear = new Date().getFullYear();
    const team = interaction.options.getString('team');
    const teamData = team.split(' ');
    await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentYear}/types/2/teams/${teamData[1]}/record`)
        .then(async (response) => await response.json())
        .then((obj) => obj['items'][0]['summary'])
        .then((record) => interaction.reply(`The ${teamData[0]} currently stand at ` + record))
}

