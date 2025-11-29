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
        if (args.length < 3) {
            return message.reply("Utilisation : `!7 stats [S4|S5] [joueur|équipe] [nom]`");
        }

        const saison = args[0].toUpperCase();
        const type = args[1].toLowerCase();
        const name = args.slice(2).join(' '); // Pour les noms avec espaces

        if (!['s3', 's4', 's5'].includes(saison.toLowerCase())) {
            return message.reply("Veuillez spécifier une saison valide (`S4` ou `S5`).");
        }

        if (!['joueur', 'équipe'].includes(type)) {
            return message.reply("Veuillez spécifier `joueur` ou `équipe` après la saison.");
        }

        try {
            const stats = await getStats(saison, type, name);

            if (!stats) {
                return message.reply(`Aucune statistique trouvée pour **${name}** (${type}, ${saison}).`);
            }

            // Transformer les secondes en minutes et secondes
            const tempsDeJeuJoueur = formatTime(parseInt(stats[30]));
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
                            `> **Manches jouées :** ${stats[4]}\n` +
                            `> **Manches gagnées :** ${stats[5]}\n` +
                            `> **Manches perdues :** ${Number(stats[4]) - Number(stats[5])}\n` +
                            `> **Taux V / D :** ${stats[6]} - #${stats[7]}\n` +
                            `> **Temps de jeu :** ${tempsDeJeuJoueur}\n`,
                        inline: true,
                    },
                    {
                        name: `📝 Informations Division ${stats[0]}`,
                        value:
                            `> **Nb joueurs dans la div :** ${stats[51]}\n` +
                            `> **Nb joueurs classés dans la div :** ${stats[50]}`,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: false,
                    },
                    {
                        name: '⚔️ Liquidations',
                        value:
                            `> **Avec assist. :** ${stats[8]} - #${stats[9]}\n` +
                            `> **Sans assist. :** ${stats[12]} - #${stats[13]}\n` +
                            `> **Assist. :** ${stats[16]} - #${stats[17]}\n` +
                            `> **Subies :** ${stats[20]} - #${stats[21]}\n` +
                            `> **Ratio :** ${stats[24]} - #${stats[25]}\n`,
                        inline: true,
                    },
                    {
                        name: '🔫 Par manche',
                        value:
                            `> **Avec assist. :** ${stats[10]} - #${stats[11]}\n` +
                            `> **Sans assist. :** ${stats[14]} - #${stats[15]}\n` +
                            `> **Assist. :** ${stats[18]} - #${stats[19]}\n` +
                            `> **Subies :** ${stats[22]} - #${stats[23]}\n`,
                        inline: true,
                    },
                    {
                        name: '⏱️ Par minute',
                        value:
                            `> **Avec assist. :** ${stats[42]} - #${stats[43]}\n` +
                            `> **Sans assist. :** ${stats[36]} - #${stats[37]}\n` +
                            `> **Assist. :** ${stats[40]} - #${stats[41]}\n` +
                            `> **Subies :** ${stats[38]} - #${stats[39]}\n`,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: false,
                    },
                    {
                        name: '🎯 Divers',
                        value:
                            `> **Spéciaux :** ${stats[26]} - #${stats[27]}\n` +
                            `> **Territoire encré :** ${stats[31]} - #${stats[32]}\n`,
                        inline: true,
                    },
                    {
                        name: '⏱️ Par minute',
                        value:
                            `> **Spéciaux :** ${stats[44]} - #${stats[45]}\n` +
                            `> **Territoire encré :** ${stats[46]} - #${stats[47]}\n`,
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
