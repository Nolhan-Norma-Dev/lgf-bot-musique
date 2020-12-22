'use strict';
const corePlayer = require('./../../core/player');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'destroy',
    description: 'Détruisez et réinitialisez le flux',
    usage: 'destroy',
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
        if (!corePlayer.hasPermission(client, message)) {
            const call = await corePlayer.callRequest(message, new MessageEmbed(), {
                required: `Exiger {{mustVote}} votes pour détruire le flux`,
                complete: `Vote terminé, vous détruisez le flux`,
                content: `Vote {{haveVoted}}/{{mustVote}}`,
            });
            if (call) {
                if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
                player.dispatcher.destroy();
                message.member.voice.channel.leave();
                client.music[message.guild.id] = {
                    queue: [],
                    index: 0,
                    isPlaying: false,
                    volume: 0.50,
                    type: null,
                    dispatcher: false,
                    connection: false,
                    loop: 'off',
                    broadcast: false,
                    muteIndicator: false,
                    backup: {
                        index: null,
                        seek: null,
                    },
                }
            } else {
                return message.channel.send(`Vous ne détruisez pas le flux`);
            };
        } else {
            player.dispatcher.destroy();
            message.member.voice.channel.leave();
            client.music[message.guild.id] = {
                queue: [],
                index: 0,
                isPlaying: false,
                volume: 0.50,
                type: null,
                dispatcher: false,
                connection: false,
                loop: 'off',
                broadcast: false,
                muteIndicator: false,
                backup: {
                    index: null,
                    seek: null,
                },
            }
        };
    },
};
