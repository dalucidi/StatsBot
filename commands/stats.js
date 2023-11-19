import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('statsbot')
    .setDescription('This is my demo');

export async function execute(interaction) {
    await interaction.reply('Hello master.');
}

