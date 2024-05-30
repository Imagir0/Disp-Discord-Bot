const clear = require('./clear'); // Importer la fonction clear

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = {
    name: 'modify',
    description: 'Modifie un évènement sur un jour de la semaine créé avec la fonction "!7disp".',
    async execute(message, args) {
        // Vérifier si un jour de la semaine a été fourni
        if (!args.length) {
            return message.reply('Vous devez spécifier un jour de la semaine. Exemple: !7modify lundi');
        }

        const dayToModify = args[0].toLowerCase();
        const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

        // Vérifier si le jour fourni est valide
        if (!daysOfWeek.includes(dayToModify)) {
            return message.reply('Vous devez spécifier un jour de la semaine valide. Exemple: !7modify lundi');
        }

        // Chercher les messages du bot qui contiennent le jour de la semaine donné
        const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
        const botMessages = fetchedMessages.filter(msg => 
            msg.author.id === message.client.user.id && msg.content.toLowerCase().includes(dayToModify)
        );

        if (botMessages.size === 0) {
            return message.reply(`Aucun message contenant "${dayToModify}" n'a été trouvé.`);
        }

        // Demander à l'utilisateur le nouveau contenu du message
        message.channel.send(`Entrez le nouveau contenu pour le jour "${capitalizeFirstLetter(dayToModify)}":`);
        
        const filter = response => response.author.id === message.author.id;
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

        let newContent;
        const userResponse = collected.first().content.toLowerCase();
        if (userResponse === "annulé" || userResponse === "rien") {
            newContent = `${capitalizeFirstLetter(dayToModify)}`;
        } else {
            newContent = `${capitalizeFirstLetter(dayToModify)} (${userResponse})`;
        }

        // Modifier le contenu des messages trouvés
        botMessages.forEach(msg => msg.edit(newContent));

        // On supprime les commandes passées
        await clear.execute(message, ['3'], message.author);
    },
};
