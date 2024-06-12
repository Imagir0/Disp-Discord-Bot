const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');

async function ping(client, guildId, channelId, roleId, yesEmoji, noEmoji, notifyHour, notifyMinute) {
    const job = schedule.scheduleJob({ hour: notifyHour, minute: notifyMinute }, async () => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            const channel = guild.channels.cache.get(channelId);
            if (channel) {

                const embedMessage = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Notification quotidienne')
                    .setDescription(`Qui joue ce soir ?`);

                const sentMessage = await channel.send({
                    content: `<@&${roleId}>\n`, 
                    embeds: [embedMessage]
                });
                await sentMessage.react(yesEmoji);
                await sentMessage.react(noEmoji);

                const updateEmbed = async () => {
                    const fullMessage = await sentMessage.fetch();
                    const yesReaction = fullMessage.reactions.cache.get(yesEmoji);
                    const noReaction = fullMessage.reactions.cache.get(noEmoji);

                    const yesUsers = yesReaction ? await yesReaction.users.fetch() : [];
                    const noUsers = noReaction ? await noReaction.users.fetch() : [];

                    const yesUsernames = await Promise.all(yesUsers.filter(user => !user.bot).map(async user => {
                        const member = await guild.members.fetch(user.id);
                        return member.displayName;
                    }));

                    const noUsernames = await Promise.all(noUsers.filter(user => !user.bot).map(async user => {
                        const member = await guild.members.fetch(user.id);
                        return member.displayName;
                    }));

                    const updatedEmbed = new EmbedBuilder()
                        .setColor('#ffffff')
                        .setTitle('Notification quotidienne')
                        .setDescription(`Qui joue ce soir ?`)
                        .addFields(
                            { name: `✅ Accepté (${yesUsernames.length})`, value: yesUsernames.join('\n') || '-', inline: true },
                            { name: `❌ Refusé (${noUsernames.length})`, value: noUsernames.join('\n') || '-', inline: true }
                        );

                    await sentMessage.edit({ embeds: [updatedEmbed] });
                };

                const handleReactionChange = async (reaction, user) => {
                    if (reaction.partial) {
                        try {
                            await reaction.fetch();
                        } catch (error) {
                            console.error('Error fetching reaction:', error);
                            return;
                        }
                    }

                    if (reaction.message.id === sentMessage.id && !user.bot) {
                        await updateEmbed();
                    }
                };

                client.on('messageReactionAdd', handleReactionChange);
                client.on('messageReactionRemove', handleReactionChange);

            } else {
                console.error('Canal introuvable.');
            }
        } else {
            console.error('Guilde introuvable.');
        }
    });
}


async function handleReactionAdd(reaction, user, client) {
    if (user.bot) return; // Ignore bot reactions

    // Fetch partial reactions or messages
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Error fetching reaction:', error);
            return;
        }
    }

    const message = reaction.message;
    if (message.author.id !== client.user.id) return; // Only handle reactions to bot messages

    // Remove bot's reaction
    const botReactions = message.reactions.cache.filter(r => r.users.cache.has(client.user.id));
    for (const botReaction of botReactions.values()) {
        if (botReaction.emoji.name === reaction.emoji.name) {
            await botReaction.users.remove(client.user.id);
        }
    }
}

async function handleReactionRemove(reaction, user, client) {
    if (user.bot) return; // Ignore bot reactions

    // Fetch partial reactions or messages
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Error fetching reaction:', error);
            return;
        }
    }

    const message = reaction.message;
    if (message.author.id !== client.user.id) return; // Only handle reactions to bot messages

    // Re-add bot's reaction if no other user has reacted with that emoji
    const users = await reaction.users.fetch();
    if (!users.has(client.user.id)) {
        await reaction.message.react(reaction.emoji);
    }
}

module.exports = { ping, handleReactionAdd, handleReactionRemove };
