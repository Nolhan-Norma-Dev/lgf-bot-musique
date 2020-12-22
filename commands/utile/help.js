'use strict';
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Listes des commandes de NordKey.Musique',
    usage: 'help',
    category: 'utile',
    aliases: ['h'],
    botPerm: ['MANAGE_MESSAGES', 'EMBED_LINKS'],
    userPerm: [],
    admin: false,
    nsfw: false,
    guildOnly: true,
    enabled: true,
    execute: async function (client, message, args) {
        const commands = client.commands;
        const cmd = {};
        for (const key of commands.filter(command => command.enabled)) {
            if (!cmd[key[1].category]) {
                cmd[key[1].category] = [];
            };
            cmd[key[1].category].push(key[1]);
        };
        const helpEmbed = new MessageEmbed()
            .setTitle('Commande Help \"NordKey.Musique\"')
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTimestamp(Date.now())
            .setDescription('Prefix : **m+**\nExemple : \`m+play\`')
            .setFooter(client.user.username, client.user.displayAvatarURL());
            
        for (const key in cmd) {
            helpEmbed.addField(`**${cmd[key].length} · ${key}**`, cmd[key].map((v) => `**\`${v.name}\`** : ${v.description}`).join('\n\n'), true);
        };

        message.channel.send({embed: helpEmbed});
    },
};
