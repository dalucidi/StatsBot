import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('recordsnfc')
    .setDescription('Gets the current record of a given NFC team')
    .addStringOption(option => 
        option.setName('team')
        .setDescription('The team who\'s standing to check')
        .setRequired(true)
        .addChoices(
            { name: 'Falcons', value: 'Falcons 1'},
            { name: 'Bears', value: 'Bears 3'},
            { name: 'Cowboys', value: 'Cowboys 6'},
            { name: 'Lions', value: 'Lions 8'},
            { name: 'Packers', value: 'Packers 9'},
            { name: 'Rams', value: 'Rams 14'},
            { name: 'Vikings', value: 'Vikings 16'},
            { name: 'Saints', value: 'Saints 18'},
            { name: 'Giants', value: 'Giants 19'},
            { name: 'Eagles', value: 'Eagles 21'},
            { name: 'Cardinals', value: 'Cardinals 22'},
            { name: '49ers', value: '49ers 25'},
            { name: 'Seahawks', value: 'Seahawks 26'},
            { name: 'Buccaneers', value: 'Buccaneers 27'},
            { name: 'Commanders', value: 'Commanders 28'},
            { name: 'Panthers', value: 'Panthers 29'},
        )
    );

export async function execute(interaction) {
    const team = interaction.options.getString('team');
    const teamData = team.split(' ');
    await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2023/types/2/teams/${teamData[1]}/record`)
        .then(async (response) => await response.json())
        .then((obj) => obj['items'][0]['summary'])
        .then((record) => interaction.reply(`The ${teamData[0]} currently stand at ` + record))
}

