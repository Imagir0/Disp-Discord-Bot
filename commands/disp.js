module.exports = {
    name: 'disp',
    description: 'Envoie les jours de la semaine pour les disponibilités.',
    execute(message, args) {
        
        // Messages
        message.channel.send(`Mettez vos disponibilités de la semaine ! <@&${1060276629047345352}>`);
        message.channel.send('Lundi').then(sentMessage => {
            sentMessage.react('<:yes:1060307378492428399>');
            sentMessage.react('<:nope:1060307465914290249>');
        });
        message.channel.send('Mardi').then(sentMessage => {
            sentMessage.react('<:yes:1060307378492428399>');
            sentMessage.react('<:nope:1060307465914290249>');
        });
        message.channel.send('Mercredi').then(sentMessage => {
            sentMessage.react('<:yes:1060307378492428399>');
            sentMessage.react('<:nope:1060307465914290249>');
        });
        message.channel.send('Jeudi').then(sentMessage => {
            sentMessage.react('<:yes:1060307378492428399>');
            sentMessage.react('<:nope:1060307465914290249>');
        });
        message.channel.send('Vendredi').then(sentMessage => {
            sentMessage.react('<:yes:1060307378492428399>');
            sentMessage.react('<:nope:1060307465914290249>');
        });
        message.channel.send('Samedi').then(sentMessage => {
            sentMessage.react('<:yes:1060307378492428399>');
            sentMessage.react('<:nope:1060307465914290249>');
        });
        message.channel.send('Dimanche').then(sentMessage => {
            sentMessage.react('<:yes:1060307378492428399>');
            sentMessage.react('<:nope:1060307465914290249>');
        });

    },
};