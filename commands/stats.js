const { EmbedBuilder } = require('discord.js');
const { getUserStats } = require('../functions/sheets');

module.exports = {
    name: 'stats',
    description: 'Renvoie les stats d\'un utilisateur ou d\'une équipe sélectionnée.',
    async execute(message, args) {
        const username = args.join(' ').trim();
        if (!username) {
            return message.reply("Veuillez fournir un nom d'utilisateur.");
        }

        try {
            const stats = await getUserStats(username);
            if (!stats) {
                return message.reply(`Aucune statistique trouvée pour l'utilisateur **${username}**.`);
            }

            // Création de l'embed
            const embed = new EmbedBuilder()
                .setTitle(`📊 Statistiques de ${username}`)
                .setColor(0x00AE2F)
                .addFields(
                    {
                      name: '🟩 Résultats',
                      value:
                        `> **Victoires :** ${stats[1]}\n` +
                        `> **Défaites :** ${stats[2]}\n` +
                        `> **Manches gagnées :** ${stats[3]}\n` +
                        `> **Manches perdues :** ${stats[4]}\n` +
                        `> **Manches jouées :** ${Number(stats[3]) + Number(stats[4])}`
                        `> **% Victoires manches :** ${stats[6]}`,
                      inline: false,
                    },
                    {
                      name: '🥊 KO',
                      value:
                        `> **KO infligés :** ${stats[7]}\n` +
                        `> **KO subis :** ${stats[8]}\n` +
                        `> **% KO infligés :** ${stats[9]}\n` +
                        `> **% KO subis :** ${stats[10]}`,
                      inline: false,
                    },
                    {
                      name: '⏱️ Prolongations',
                      value:
                        `> **Victoires en prolongations :** ${stats[11]}\n` +
                        `> **Défaites en prolongations :** ${stats[12]}\n` +
                        `> **Prolongations disputées :** ${stats[13]}`,
                      inline: false,
                    },
                    {
                      name: '⚔️ Liquidations',
                      value:
                        `> **Prises :** ${stats[14]}\n` +
                        `> **Subies :** ${stats[15]}\n` +
                        `> **Ratio :** ${stats[16]}`,
                      inline: false,
                    },
                    {
                      name: '🎯 Autres stats',
                      value:
                        `> **Spéciaux lancés :** ${stats[17]}\n` +
                        `> **Territoire encré :** ${stats[18]}\n` +
                        `> **Temps de jeu (s):** ${stats[19]}`,
                      inline: false,
                    }
                  );
                                

            const sent = await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.reply("Une erreur est survenue lors de la récupération des stats.");
        }
    },
};
