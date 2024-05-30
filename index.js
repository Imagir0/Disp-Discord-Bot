require('dotenv').config();  // Charger les variables d'environnement à partir du fichier .env
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Créez une collection pour les commandes / 1 fichier = 1 commande
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Chargez les commandes
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

// Chargement du bot
client.once('ready', () => {
    console.log('Le bot est en ligne !');
});

client.on('messageCreate', message => {

    // Ignore messages from bots
    if (message.author.bot) return;

    // Vérifiez si le message commence par un préfixe
    const prefix = '!7';
    if (!message.content.startsWith(prefix)) return;

    // Extrayez la commande du message
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Vérifiez si la commande existe
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    // Exécutez la commande
    try {
        command.execute(message, args, message.author);
    } catch (error) {
        console.error(error);
        message.reply('Il y a eu une erreur en exécutant cette commande.');
    }

});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return; // Ignore bot reactions

    // Fetch partial reactions or messages
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Error fetching reaction:', error);
            return;
        }
    }

    const message = reaction.message;
    if (message.author.id !== client.user.id) return; // Only handle reactions to bot messages

    // Remove bot's reaction
    const botReactions = message.reactions.cache.filter(r => r.users.cache.has(client.user.id));
    for (const botReaction of botReactions.values()) {
        if (botReaction.emoji.name === reaction.emoji.name) {
            await botReaction.users.remove(client.user.id);
        }
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return; // Ignore bot reactions

    // Fetch partial reactions or messages
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Error fetching reaction:', error);
            return;
        }
    }

    const message = reaction.message;
    if (message.author.id !== client.user.id) return; // Only handle reactions to bot messages

    // Re-add bot's reaction if no other user has reacted with that emoji
    const users = await reaction.users.fetch();
    if (!users.has(client.user.id)) {
        await reaction.message.react(reaction.emoji);
    }
});

// Lire le token du bot
client.login(process.env.DISCORD_TOKEN);
