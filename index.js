require('dotenv').config();  // Charger les variables d'environnement à partir du fichier .env
const { yesEmoji, noEmoji, prefix, roleId, guildId, channelId, notifyHour, notifyMinute } = require('./config');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, Collection } = require('discord.js');
const { ping, handleReactionAdd, handleReactionRemove } = require('./functions/dailyPing');
const { getUserStats } = require('./functions/sheets');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User]
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

    // Planifier la notification quotidienne
    ping(client, guildId, channelId, roleId, yesEmoji, noEmoji, notifyHour, notifyMinute);

});

// Commandes du bot
client.on('messageCreate', message => {

    // Ignore messages from bots
    if (message.author.bot) return;

    // Vérifiez si le message commence par un préfixe
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Extrayez la commande du message
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Vérifiez si la commande existe
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    
    if (!command) {
        return message.reply(`Commande inconnue. Tapez \`!7help\` pour voir la liste des commandes disponibles.`);
    }

    // Exécutez la commande
    try {
        command.execute(message, args, message.author);
    } catch (error) {
        console.error(error);
        message.reply('Il y a eu une erreur en exécutant cette commande.');
    }

});

// Gestion des réactions pour le ping journalier
client.on('messageReactionAdd', (reaction, user) => {
    handleReactionAdd(reaction, user, client);
});
client.on('messageReactionRemove', (reaction, user) => {
    handleReactionRemove(reaction, user, client);
});

// Lire le token du bot
client.login(process.env.DISCORD_TOKEN);
