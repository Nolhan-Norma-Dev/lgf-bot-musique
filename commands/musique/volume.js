'use strict';
const corePlayer = require('./../../core/player');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'volume',
    description: 'régler le volume',
    usage: 'volume [number]',
    aliases: [],
    category: 'musique',
    botPerm: ['MANAGE_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
    userPerm: [],
    admin: false,
    nsfw: false,
    guildOnly: true,
    enabled: true,
    execute: async function (client, message, args) {
        if (!message.member.voice.channel) return message.reply('💢');
        const player = corePlayer.initPlayer(client, message.guild.id);
        if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
        if (!args.join('') || isNaN(args.join(''))) {
            return message.channel.send(`Vous devez entrer une valeur numérique !`);
        };
        if (!corePlayer.hasPermission(client, message)) {
            const call = await corePlayer.callRequest(message, new MessageEmbed(), {
                required: `Exiger {{mustVote}} votes pour le volume défini`,
                complete: `Vote terminé, vous définissez le volume`,
                content: `Vote {{haveVoted}}/{{mustVote}}`,
            });
            if (call) {
                if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
                player.dispatcher.setVolume(args.join('')/100);
            } else {
                return message.channel.send(`Vous ne sautez pas de musique`);
            };
        } else {
            player.dispatcher.setVolume(args.join('')/100);
        };
    },
};
