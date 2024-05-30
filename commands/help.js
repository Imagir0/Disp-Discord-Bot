module.exports = {
    name: 'help',
    description: 'Liste toutes les commandes disponibles.',
    execute(message, args) {
        const commands = message.client.commands;

        let helpMessage = 'Voici la liste des commandes disponibles :\n';
        commands.forEach(command => {
            helpMessage += `**!7${command.name}** : ${command.description}\n`;
        });

        message.channel.send(helpMessage);
    },
};
