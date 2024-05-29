const clear = require('./clear'); // Importer la fonction clear

module.exports = {
    name: 'disp',
    description: 'Envoie les jours de la semaine pour les disponibilités et demande des événements spéciaux.',
    async execute(message, args) {
        // Tableau des jours de la semaine
        const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const roleId = '1060276629047345352'; // Rôle à notifier
        const yesEmoji = '<:yes:1060307378492428399>'; // emoji "yes"
        const nopeEmoji = '<:nope:1060307465914290249>'; // emoji "nope"

        // Objet pour stocker les événements spéciaux
        const events = {};

        // Fonction pour poser une question et attendre une réponse
        const askQuestion = async (question, filter) => {
            await message.channel.send(question);
            const collected = await message.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ['time']
            });
            return collected.first().content.toLowerCase();
        };

        // Parcourir le tableau des jours et envoyer les messages
        for (const day of daysOfWeek) {

            // Poser la question pour un événement spécial
            const filter = response => response.author.id === message.author.id;
            const specialEventAnswer = await askQuestion(`Y a-t-il un événement spécial pour ${day} ?\nEntrez le nom, si oui / Sinon, mettez "non"`, filter);

            if (specialEventAnswer != 'non') {
                events[day] = specialEventAnswer;
            } else {
                events[day] = ''; // Pas d'événement spécial
            }
        }

        // Avant d'afficher les jours, on clean le salon
        await clear.execute(message, ['7'], message.author); // Remplacez '7' par le nombre de messages à supprimer


        // Envoyer le message initial avec retour à la ligne
        await message.channel.send(`Mettez vos disponibilités de la semaine !\n<@&${roleId}>`);

        // Envoyer les messages avec les jours et les événements associés
        for (const day of daysOfWeek) {
            const eventMessage = events[day] ? ` (${events[day]})` : '';
            await message.channel.send(`${day}${eventMessage}`).then(sentMessage => { 
                sentMessage.react(yesEmoji);
                sentMessage.react(nopeEmoji);
            }); 
        }
    },
};