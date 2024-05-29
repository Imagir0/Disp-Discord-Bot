module.exports = {
    name: 'clear',
    description: 'Supprime un nombre spécifié de messages, y compris ceux d\'un utilisateur spécifique.',
    async execute(message, args, user) {
        let amount = 100;

        if (args.length > 0) {
            amount = parseInt(args[0]);
        }

        if (isNaN(amount) || amount <= 0) {
            return message.reply('Vous devez entrer un nombre de messages à supprimer.');
        }

        if (amount > 100) {
            return message.reply('Vous pouvez supprimer jusqu\'à 100 messages à la fois.');
        }

        try {
            // Récupérer les messages et filtrer par utilisateur si fourni
            const fetchedMessages = await message.channel.messages.fetch({ limit: amount });

            const messagesToDelete = fetchedMessages.filter(msg => 
                (user && msg.author.id === user.id) || msg.author.id === message.client.user.id
            );

            await message.channel.bulkDelete(messagesToDelete, true);
        } catch (err) {
            console.error(err);
            message.channel.send('Il y a eu une erreur en essayant de supprimer les messages dans ce canal !');
        }
    },
};