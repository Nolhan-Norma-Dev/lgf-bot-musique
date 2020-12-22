'use strict';

const { Message } = require("discord.js");

module.exports = {
    name: 'message',
    /**
     * Execute event
     * @param {Client} client 
     * @param {Message} message
     * @return {Promise<Message>|null}
     */
    execute: function (client, message) {
        if (message.author.bot || message.system) return null;
        if (!message.content.startsWith(client.config.prefix)) return null;
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        if (!cmd) return null;
        if (!message.guild && cmd.guildOnly) {
            return message.channel.send(`Cette commande n'est disponible que dans une guilde`);
        };
        if (message.guild && !message.channel.permissionsFor(message.guild.me).has(cmd.botPerm, {checkAdmin: true})) {
           return message.reply(`J'ai besoin des autorisations \`${cmd.botPerm.join('`, `')}\` pour travailler correctement`);
        };
        if (message.guild && message.guild.ownerID !== message.member.id && !message.channel.permissionsFor(message.member).has(cmd.userPerm, {checkAdmin: true})) {
           return message.reply(`Vous avez besoin de \`${cmd.userPerm.join('`, `')}\` pour cette commande`);
        };
        if (!cmd.enabled) {
            return message.channel.send('Cette commande est désactivée.');
        };
        cmd.execute(client, message, args);
    },
};
