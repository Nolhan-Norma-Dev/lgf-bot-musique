'use strict';
const corePlayer = require('./../../core/player');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Afficher la file d\'attente',
    usage: 'queue',
    aliases: [],
    category: 'musique',
    botPerm: ['MANAGE_MESSAGES', 'EMBED_LINKS'],
    userPerm: [],
    admin: false,
    nsfw: false,
    guildOnly: true,
    enabled: true,
    execute: async function (client, message, args) {
        const player = corePlayer.initPlayer(client, message.guild.id);
        if (!player.queue || player.queue.length <= 0) return message.channel.send(`La file d'attente est vide`);
        let totalTime = 0;
        player.queue.map(v => totalTime = totalTime + v.time/1000);
        const queueEmbed = new MessageEmbed()
            .setTitle(`${message.guild.name} queue`)
            .setDescription(player.queue.map((v, i) => `[${i+1}] ${v.snippet.title} - Demandé par ${v.request}`))
            .addField('Temps de la Playlist : ', `${corePlayer.parseSeconde(totalTime)}`);
        message.channel.send({embed: queueEmbed});        
    },
};
