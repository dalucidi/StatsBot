import {Client, Events, GatewayIntentBits} from 'discord.js';
import {config} from 'dotenv';
import * as stats from './commands/statsbot.js'
import * as records from './commands/records.js'
import * as upcoming from './commands/upcoming.js'
import * as birds from './commands/birds.js'
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

function validTeamOption(interaction) {
    if (!interaction.options.getString('team')) return interaction.reply(`Go Birds`);

    let result = false;
    let teamName = interaction.options.getString('team').split(' ')[0];
    result = !!allTeams.find(t => t.name == teamName);

    if(!result) interaction.reply(`No team named ${teamName} found`)
    return result;
}

async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;

    switch(interaction.commandName) {
        case "statsbot":
            await stats.execute(interaction);
            break;
        case "records":
            if (!validTeamOption(interaction)) break;
            await records.execute(interaction);
            break;
        case "upcoming":
            if (!validTeamOption(interaction)) break;
            await upcoming.execute(interaction);
            break;
        case "birds":
            await birds.execute(interaction);
            break;
        default:
            interaction.reply(`Invalid Command`);
            break;
    } 
}

client.once(Events.ClientReady, readyDiscord)

client.login(process.env.TOKEN);

client.on(Events.InteractionCreate, handleInteraction)

client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isAutocomplete()) return;
    if (interaction.commandName !== 'records' && interaction.commandName !== 'upcoming') return;

    const focusedValue = interaction.options.getFocused();
    const filteredChoices = allTeams.filter((team) => team.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

    interaction.respond(filteredChoices.slice(0, 25)).catch(() => {});
})