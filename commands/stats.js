const { EmbedBuilder } = require('discord.js');
const { getStats } = require('../functions/sheets');

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hoursPart = hrs > 0 ? `${hrs}h ` : '';
    const minutesPart = mins > 0 ? `${mins}m ` : '';
    const secondsPart = `${secs}s`;

    return `${hoursPart}${minutesPart}${secondsPart}`.trim();
}


module.exports = {
    name: 'stats',
    description: 'Renvoie les stats d\'un joueur ou d\'une équipe.',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply("Utilisation : `!7 stats joueur [nomJoueur]` ou `!7 stats équipe [nomÉquipe]`");
        }

        const type = args[0].toLowerCase();
        const name = args.slice(1).join(' '); // Pour les noms avec espaces

        if (!['joueur', 'équipe'].includes(type)) {
            return message.reply("Veuillez spécifier `joueur` ou `équipe` après `!7 stats`.");
        }

        try {
            const stats = await getStats(type, name);

            if (!stats) {
                return message.reply(`Aucune statistique trouvée pour **${name}** dans la catégorie **${type}**.`);
            }

            // Transformer les secondes en minutes et secondes
            const tempsDeJeuJoueur = formatTime(parseInt(stats[17]));
            const tempsDeJeuEquipe = formatTime(parseInt(stats[20]));

            // Création de l'embed
            const embed = type === 'joueur' ? {
                title: `📊 Statistiques du joueur ${name}`,
                color: 0x3C78D8,
                fields: [
                    {
                        name: '',
                        value:
                            `> **Division :** ${stats[0]}\n` +
                            `> **Équipe :** ${stats[1]}\n` +
                            `> **Manches jouées :** ${stats[3]}\n` +
                            `> **Manches gagnées :** ${stats[4]}\n` +
                            `> **Manches perdues :** ${Number(stats[3]) - Number(stats[4])}\n` +
                            `> **Ratio V / D :** ${stats[5]}\n` +
                            `> **Temps de jeu :** ${tempsDeJeuJoueur}\n`,
                        inline: false,
                    },
                    {
                        name: '⚔️ Liquidations',
                        value:
                            `> **Avec assist. :** ${stats[6]}\n` +
                            `> **Sans assist. :** ${stats[8]}\n` +
                            `> **Assist. :** ${stats[10]}\n` +
                            `> **Subies :** ${stats[12]}\n` +
                            `> **Ratio :** ${stats[14]}\n`,
                        inline: true,
                    },
                    {
                        name: '🔫 Par manche',
                        value:
                            `> **Avec assist. :** ${stats[7]}\n` +
                            `> **Sans assist. :** ${stats[9]}\n` +
                            `> **Assist. :** ${stats[11]}\n` +
                            `> **Subies :** ${stats[13]}\n`,
                        inline: true,
                    },
                    {
                        name: '⏱️ Par minute',
                        value:
                            `> **Avec assist. :** ${stats[24]}\n` +
                            `> **Sans assist. :** ${stats[21]}\n` +
                            `> **Assist. :** ${stats[23]}\n` +
                            `> **Subies :** ${stats[22]}\n`,
                        inline: true,
                    },
                    {
                        name: '🎯 Divers',
                        value:
                            `> **Spéciaux :** ${stats[15]}\n` +
                            `> **Territoire encré :** ${stats[18]}\n`,
                        inline: true,
                    },
                    {
                        name: '⏱️ Par minute',
                        value:
                            `> **Spéciaux :** ${stats[25]}\n` +
                            `> **Territoire encré :** ${stats[26]}`,
                        inline: true,
                    }
                ]
            }
                :
                {
                    title: `📊 Statistiques de l'équipe ${name}`,
                    color: 0xF1C232,
                    fields: [
                        {
                            name: '',
                            value:
                                `> **Division :** ${stats[0]}\n` +
                                `> **Victoires :** ${stats[2]}\n` +
                                `> **Défaites :** ${stats[3]}\n` +
                                `> **Manches gagnées :** ${stats[4]}\n` +
                                `> **Manches perdues :** ${stats[5]}\n` +
                                `> **Manches jouées :** ${Number(stats[4]) + Number(stats[5])}\n` +
                                `> **% Victoires manches :** ${stats[7]}`,
                            inline: false,
                        },
                        {
                            name: '🥊 KO',
                            value:
                                `> **KO infligés :** ${stats[8]}\n` +
                                `> **KO subis :** ${stats[9]}\n` +
                                `> **% KO infligés :** ${stats[10]}\n` +
                                `> **% KO subis :** ${stats[11]}`,
                            inline: true,
                        },
                        {
                            name: '⏱️ Prolongations',
                            value:
                                `> **Victoires :** ${stats[12]}\n` +
                                `> **Défaites :** ${stats[13]}\n` +
                                `> **Total :** ${stats[14]}`,
                            inline: true,
                        },
                        { name: '', value: '', inline: true },
                        {
                            name: '⚔️ Liquidations',
                            value:
                                `> **Prises :** ${stats[15]}\n` +
                                `> **Subies :** ${stats[16]}\n` +
                                `> **Ratio :** ${stats[17]}`,
                            inline: true,
                        },
                        {
                            name: '⏱️ Par minute',
                            value:
                                `> **Prises :** ${stats[22]}\n` +
                                `> **Subies :** ${stats[23]}`,
                            inline: true,
                        },
                        { name: '', value: '', inline: true },
                        {
                            name: '🎯 Autres stats',
                            value:
                                `> **Spéciaux :** ${stats[18]}\n` +
                                `> **Territoire :** ${stats[19]}\n` +
                                `> **Temps de jeu :** ${tempsDeJeuEquipe}`,
                            inline: true,
                        },
                        {
                            name: '⏱️ Par minute',
                            value:
                                `> **Spéciaux :** ${stats[24]}\n` +
                                `> **Territoire :** ${stats[25]}`,
                            inline: true,
                        }
                    ]
                }


            const sent = await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.reply("Une erreur est survenue lors de la récupération des statistiques.");
        }
    },
};
