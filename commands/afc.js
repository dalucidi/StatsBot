import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('recordsafc')
    .setDescription('Gets the current record of a given AFC team')
    .addStringOption(option => 
        option.setName('team')
        .setDescription('The team who\'s standing to check')
        .setRequired(true)
        .addChoices(
            { name: 'Bills', value: 'Bills 2'},
            { name: 'Bengals', value: 'Bengals 4'},
            { name: 'Browns', value: 'Browns 5'},
            { name: 'Broncos', value: 'Broncos 7'},
            { name: 'Titans', value: 'Titans 10'},
            { name: 'Colts', value: 'Colts 11'},
            { name: 'Chiefs', value: 'Chiefs 12'},
            { name: 'Raiders', value: 'Raiders 13'},
            { name: 'Dolphins', value: 'Dolphins 15'},
            { name: 'Patriots', value: 'Patriots 17'},
            { name: 'Jets', value: 'Jets 20'},
            { name: 'Steelers', value: 'Steelers 23'},
            { name: 'Chargers', value: 'Chargers 24'},
            { name: 'Jaguars', value: 'Jaguars 30'},
            { name: 'Ravens', value: 'Ravens 33'},
            { name: 'Texans', value: 'Texans 34'}
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

