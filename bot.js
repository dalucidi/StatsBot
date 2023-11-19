import {Client, Events, GatewayIntentBits} from 'discord.js';
import {config} from 'dotenv';
import * as stats from './commands/stats.js'
import * as afc from './commands/afc.js'
import * as nfc from './commands/nfc.js'

config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
})

function readyDiscord() {
    console.log('I\'m Ready! ' + client.user.tag);
}

async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName == 'statsbot') {
        await stats.execute(interaction);
    }
    if (interaction.commandName == 'recordsafc') {

        await afc.execute(interaction);
    }
    if (interaction.commandName == 'recordsnfc') {

        await nfc.execute(interaction);
    }
}

client.once(Events.ClientReady, readyDiscord)

client.login(process.env.TOKEN);

client.on(Events.InteractionCreate, handleInteraction)