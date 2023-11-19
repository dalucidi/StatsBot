import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('statsbot')
    .setDescription('Help command for StatsBot');

export async function execute(interaction) {
    await interaction.reply('__**---Currently Available Commands---**__\n**/records {*team name*}** | Gets the current record for a given team\n**/upcoming {*team name*}** | returns a teams matchup for the week');
}

