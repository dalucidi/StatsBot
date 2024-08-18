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
    try {
        const currentYear = new Date().getFullYear();
        const team = interaction.options.getString('team');
        const teamData = team.split(' ');
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

        console.log(currentYear)
        console.log(seasonType)
        console.group(teamData[1])

        console.log(new Date().getMonth());
        await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentYear}/types/${seasonType}/teams/${teamData[1]}/record`)
            .then(async (response) => await response.json())
            .then((obj) => obj['items'][0]['summary'])
            .then((record) => interaction.reply(`The ${teamData[0]} currently stand at ` + record + ` ${teamData[2]}`))
    }
    catch (error) {
        interaction.reply('Something went wrong. Anyways go birds');
        console.log(error);
    }
}

