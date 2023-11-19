import {Client, Events, GatewayIntentBits} from 'discord.js';
import {config} from 'dotenv';
import * as stats from './commands/stats.js'
import * as records from './commands/records.js'
import * as afcTeams from './afc-teams.js'
import * as nfcTeams from './nfc-teams.js'

config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
})

const allTeams = afcTeams.teams.concat(nfcTeams.teams);

function readyDiscord() {
    console.log('I\'m Ready! ' + client.user.tag);
}

async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName == 'statsbot') {
        await stats.execute(interaction);
    }
    if (interaction.commandName == 'records') {

        await records.execute(interaction);
    }
}

client.once(Events.ClientReady, readyDiscord)

client.login(process.env.TOKEN);

client.on(Events.InteractionCreate, handleInteraction)

client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isAutocomplete()) return;
    if (interaction.commandName !== 'records') return;

    const focusedValue = interaction.options.getFocused();
    const filteredChoices = allTeams.filter((team) => team.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

    interaction.respond(filteredChoices.slice(0, 25)).catch(() => {});
})