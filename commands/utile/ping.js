'use strict';
const Discord = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Ping du NordKey.Musique',
    usage: 'ping',
    category: 'utile',
    aliases: [],
    botPerm: [],
    userPerm: [],
    admin: false,
    nsfw: false,
    guildOnly: false,
    enabled: true,
    execute: function(client, message, args) {

      let messageToBot = args.join('');
      message.delete().catch();

      let embed = new Discord. MessageEmbed()
      .setDescription(`**🏓 Pong ! ${client.ws.ping} ms**`)
      .setColor("#007dc5")
    message.channel.send(embed)
    },
};
