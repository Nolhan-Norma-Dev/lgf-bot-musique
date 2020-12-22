'use strict';
const corePlayer = require('./../../core/player');
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'leave',
    description: 'Quitter le bot du canal ',
    usage: 'leave',
    aliases: [],
    category: 'musique',
    botPerm: ['MANAGE_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
    userPerm: [],
    admin: false,
    nsfw: false,
    guildOnly: true,
    enabled: true,
    execute: async function(client, message, args) {
        if (!message.member.voice.channel) return message.reply('💢');
        const player = corePlayer.initPlayer(client, message.guild.id);
        if (!corePlayer.hasPermission(client, message)) {
            const call = await corePlayer.callRequest(message, new MessageEmbed(), {
                required: `Exiger {{mustVote}} votes pour rechercher le flux`,
                complete: `Vote terminé, vous cherchez le stream`,
                content: `Vote {{haveVoted}}/{{mustVote}}`,
            });
            if (call) {
                message.member.voice.channel.leave();
            } else {
                return message.channel.send(`Vous ne quittez pas le bot du channel`);
            };
        } else {
            message.member.voice.channel.leave();
        };
    },
};
