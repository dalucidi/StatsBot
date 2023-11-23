import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('birds')
    .setDescription('birds birds birds');

export async function execute(interaction) {
    await interaction.reply('Go Birds!\nhttps://www.youtube.com/watch?v=LXifQuzaVc8');
}