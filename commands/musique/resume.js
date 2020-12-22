'use strict';
const corePlayer = require('./../../core/player');
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'Définir le flux pour qu\'il reprenne',
    usage: 'resume',
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
        if (!corePlayer.hasPermission(client, message)) {
            const call = await corePlayer.callRequest(message, new MessageEmbed(), {
                required: `Exiger {{mustVote}} votes pour l'ensemble reprendre le flux`,
                complete: `Vote terminé, vous définissez reprendre le flux`,
                content: `Vote {{haveVoted}}/{{mustVote}}`,
            });
            if (call) {
                if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
                player.dispatcher.resume();
            } else {
                return message.channel.send(`Vous ne définissez pas le flux pour qu'il reprenne`);
            };
        } else {
            player.dispatcher.resume();
        };
    },
};
