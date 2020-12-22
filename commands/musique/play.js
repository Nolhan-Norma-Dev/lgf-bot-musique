'use strict';
const corePlayer = require('./../../core/player');
const htmlEntitiesDecoder = require('html-entities-decoder');
const {MessageEmbed, MessageCollector} = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Jouer une musique',
    usage: 'play (url | title)',
    aliases: ['p'],
    category: 'musique',
    botPerm: ['CONNECT', 'SPEAK', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
    userPerm: [],
    admin: false,
    nsfw: false,
    guildOnly: true,
    enabled: true,
    execute: async function(client, message, args) {
      if (!message.member.voice.channel) return message.channel.send(`Vous devez vous connecter dans un salon vocal avant!`);
      if (!corePlayer.hasPermission(client, message)) return message.channel.send(`N'avez-vous pas la permission nécessaire`);

      const player = corePlayer.initPlayer(client, message.guild.id);
      player.connection = await message.member.voice.channel.join();

      if (!args.join('') && player.queue.length >= 1) return corePlayer.play(client, message);

      const youtube = await corePlayer.getSongs(args.join(' '));
      if (youtube.error) return message.channel.send(youtube.error.message, {code: 'js'});
      if (youtube.isAxiosError) return message.channel.send(`ERREUR: code http ${youtube.status}`);

      for (const key in youtube.items) {
        youtube.items[key].snippet.title = htmlEntitiesDecoder(youtube.items[key].snippet.title);
      };

      const listEmbed = new MessageEmbed()
        .setTitle(`Voici la liste de Musique`)
        .setDescription(youtube.items.map((v, i) => `[${i+1}] ${v.snippet.title}`).join('\n'))
        .setTimestamp(Date.now())
        .setFooter(`Entrer \`annuler\` pour quitter la sélection`);
      message.channel.send({embed: listEmbed}).then((msg) => {
        const filter = (msg) => msg.author.id === message.author.id;
        const collector = new MessageCollector(message.channel, filter, {
          time: 20000,
        });
        collector.on('collect', async (msgCollected) => {
          const choice = msgCollected.content.trim().split()[0];
          if (choice.toLowerCase() === 'annuler') {
            return collector.stop('STOPPED');
          };
          if (!choice || isNaN(choice)) {
            return message.channel.send(`Votre choix n'est pas valide`);
          };
          if (choice > youtube.items.length || choice <= 0) {
            return message.reply(`Votre choix ne se trouve pas dans la sélection`);
          };
          const song = youtube.items[choice - 1];
          collector.stop('PLAY');
          msg.delete();
          msgCollected.delete();
          if (song.id.kind === 'youtube#channel') {
            return message.channel.send(`Je ne peux pas lire cette vidéo !`);
          };
          const info = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${song.id.videoId}`);
          song.time = JSON.parse(JSON.stringify(info)).length_seconds*1000;
          song.request = message.member;
          player.queue.push(song);
          player.type = 'player';
          let allTime = 0;
          player.queue.map(v => allTime = allTime + v.time/1000);
          const addQueueEmbed = new MessageEmbed()
              .setTitle(`Ajouter de la musique dans la playlist`)
              .setDescription(song.snippet.title)
              .addFields(
                  {name: 'Temps de la Musique : ', value: `${corePlayer.parseSeconde(song.time/1000)}`, inline: true},
                  {name: 'Temps de Playlist : ', value: `${corePlayer.parseSeconde(allTime)}`, inline: true},
              )
              .setThumbnail(song.snippet.thumbnails.high.url);
          message.channel.send({embed: addQueueEmbed});
          if (player.queue.length > 1) {
            if (!player.dispatcher) {
                corePlayer.play(client, message);
            };
          } else {
            if (player.queue.length <= 1) {
              player.index = 0;
            };
            corePlayer.play(client, message);
          };
        });
        collector.on('end', (collected, reason) => {
          if (reason === 'STOPPED') {
            return message.reply('Vous avez annulé la sélection');
          } else if (reason === 'PLAY') {
            return false;
          } else {
            return message.reply('Vous N\'avez pas sélectionné une chanson');
          };
        });
      });
    },
};
