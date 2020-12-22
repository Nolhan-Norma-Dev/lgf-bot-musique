'use strict';
const corePlayer = require('./../../core/player');
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'seek',
    description: 'Définir la recherche',
    usage: 'seek [number]',
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
        if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
        if (!args.join('') || isNaN(args.join(''))) {
            return message.channel.send(`Vous devez entrer une valeur numérique en quelques secondes !`);
        };
        if (!corePlayer.hasPermission(client, message)) {
            const call = await corePlayer.callRequest(message, new MessageEmbed(), {
                required: `Exiger {{mustVote}} votes pour rechercher le flux`,
                complete: `Vote terminé, vous cherchez le stream`,
                content: `Vote {{haveVoted}}/{{mustVote}}`,
            });
            if (call) {
                if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
                corePlayer.play(client, message, args.join(''));
            } else {
                return message.channel.send(`Vous ne définissez pas le flux pour qu'il reprenne`);
            };
        } else {
            corePlayer.play(client, message, args.join(''));
        };
    },
};
