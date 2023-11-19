import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('statsbot')
    .setDescription('Help command for StatsBot');

export async function execute(interaction) {
    await interaction.reply('---Currently Available Commands---\n/records {team name} returns a teams standing\n/upcoming {team name} returns a teams matchup for the week');
}

