'use strict';
const corePlayer = require('./../../core/player');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'loop',
    description: 'Définir le flux de boucle',
    usage: 'loop (on | once | off)',
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
                required: `Exiger {{mustVote}} votes pour le flux de boucle`,
                complete: `Vote terminé, vous bouclez le flux`,
                content: `Vote {{haveVoted}}/{{mustVote}}`,
            });
            if (call) {
                if (!player.dispatcher) return message.channel.send(`Je ne joue pas de musique`);
                switch (args.join('')) {
                    case 'off':
                        player.loop = 'off';
                        message.react('➡️');
                        break;
                    case 'on':
                        player.loop = 'on';
                        message.react('🔁');
                        break;
                    case 'once':
                        player.loop = 'once';
                        message.react('🔂');
                        break;
                    default:
                        if (player.loop === 'off') {
                            player.loop = 'on';
                            message.react('🔁');
                        } else if (player.loop === 'on') {
                            player.loop = 'once';
                            message.react('🔂');
                        } else if (player.loop === 'once') {
                            player.loop = 'off';
                            message.react('➡️');
                        };
                        break;
                };
            } else {
                return message.channel.send(`Vous ne sautez pas de musique`);
            };
        } else {
            switch (args.join('')) {
                case 'off':
                    player.loop = 'off';
                    message.react('➡️');
                    break;
                case 'on':
                    player.loop = 'on';
                    message.react('🔁');
                    break;
                case 'once':
                    player.loop = 'once';
                    message.react('🔂');
                    break;
                default:
                    if (player.loop === 'off') {
                        player.loop = 'on';
                        message.react('🔁');
                    } else if (player.loop === 'on') {
                        player.loop = 'once';
                        message.react('🔂');
                    } else if (player.loop === 'once') {
                        player.loop = 'off';
                        message.react('➡️');
                    };
                    break;
            };
        };
    },
};
