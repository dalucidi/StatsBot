import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('statsbot')
    .setDescription('Help command for StatsBot');

export async function execute(interaction) {
    await interaction.reply('__**---Currently Available Commands---**__\n\
    **/records {*team name*}** - Gets the current record for a given team\n\
    **/upcoming {*team name*}** - Gets a teams matchup for the week\n\
    **/leaders {*stat type*}** - Gets the top 5 players for a given stat\n\
    **/scoreboard {*team name*}** - Gets the score for a team if they play today\n\
    **/birds** - birds birds birds');
}

