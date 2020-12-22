'use strict';
const corePlayer = require('./../../core/player');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'nowplaying',
    description: 'Détruisez et réinitialisez le flux',
    usage: 'nowplaying',
    aliases: ['nowplay', 'np'],
    category: 'musique',
    botPerm: ['MANAGE_MESSAGES', 'EMBED_LINKS'],
    userPerm: [],
    admin: false,
    nsfw: false,
    guildOnly: true,
    enabled: true,
    execute: async function (client, message, args) {
        const player = corePlayer.initPlayer(client, message.guild.id);
        if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
        const duration = moment.duration({ms: player.queue[player.index].time});
        const progress = moment.duration({ms: player.dispatcher.streamTime});
        const progressBar = ['▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬'];
        const calcul = Math.round(progressBar.length * (player.dispatcher.streamTime/ (player.queue[player.index].time)));
        progressBar[calcul] = '🔘';
        const npEmbed = new MessageEmbed()
            .setTitle('Lecture en cours')
            .setDescription(`[${player.queue[player.index].snippet.title}](https://www.youtube.com/watch?v=${player.queue[player.index].id.videoId})`)
            .setThumbnail(player.queue[player.index].snippet.thumbnails.high.url)
            .addField('Durée', '[`' + progress.minutes() + ':' + progress.seconds() + '`] ' + progressBar.join('') + ' [`' + duration.minutes() + ':' + duration.seconds() + '`]')
        message.channel.send({embed: npEmbed});
    },
};
