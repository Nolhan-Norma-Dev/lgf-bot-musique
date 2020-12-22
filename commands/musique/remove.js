'use strict';
const corePlayer = require('./../../core/player');
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'remove',
    description: 'Supprimer une chanson de la playlist',
    usage: 'remove [number]',
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
            return message.channel.send(`Vous devez saisir une valeur numérique !`);
        };
        if (args.join('') > player.queue.length - 1) return message.react('💢');
        if (!corePlayer.hasPermission(client, message)) {
            const call = await corePlayer.callRequest(message, new MessageEmbed(), {
                required: `Exiger {{mustVote}} votes pour supprimer ${player.queue[args.join('')].snippet.title}`,
                complete: `Vote terminé, vous supprimez ${player.queue[args.join('')].snippet.title} de la playlist`,
                content: `Vote {{haveVoted}}/{{mustVote}}`,
            });
            if (call) {
                if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
                if (player.index > args.join('')) player.index--;
                player.queue.splice(args.join('', 1));
            } else {
                return message.channel.send(`Vous ne définissez pas le flux pour qu'il reprenne`);
            };
        } else {
            if (player.index > args.join('')) player.index--;
            player.queue.splice(args.join('', 1));
        };
    },
};
