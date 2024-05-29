const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
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

// Lire le token du bot
const tokenPath = path.join(__dirname, '../token.txt');
const token = fs.readFileSync(tokenPath, 'utf-8').trim();
client.login(token);