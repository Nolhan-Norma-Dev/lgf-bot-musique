'use strict';
const corePlayer = require('./../../core/player');
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Mettre le flux en pause',
    usage: 'pause',
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
        if (!player.dispatcher) return message.channel.send(`Lecture en cours`);
        if (!corePlayer.hasPermission(client, message)) {
            const call = await corePlayer.callRequest(message, new MessageEmbed(), {
                required: `Exiger {{mustVote}} votes pour mettre en pause le flux`,
                complete: `Vote terminé, vous avez mis en pause le flux`,
                content: `Vote {{haveVoted}}/{{mustVote}}`,
            });
            if (call) {
                if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
                player.dispatcher.pause();
            } else {
                return message.channel.send(`Vous ne définissez pas le flux sur pause`);
            };
        } else {
            player.dispatcher.pause();
        };
    },
};
